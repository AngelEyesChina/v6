"use strict";

var _ = require("underscore");
var repo = require("./repository.js");
var moment = require('moment');
var logger = require('./logger.js');
var util = require('util');

var log = function _log(text, text2) {
  logger.logDebug('exercise.js', null, text + ' ' + text2);
};

var maxDate = function (dates) {
  return dates.reduce(function (a, b) {
    return a > b ? a : b;
  });
};

var typeFunctions = {
  "AND": function (a, b) {
    return Boolean(a) && Boolean(b);
  },
  "OR": function (a, b) {
    return  Boolean(a) || Boolean(b);
  }
};

var serializeDoneList = function _serializeDoneList(doneList) {
  return _.map(doneList, function (doneMoment) {
    return doneMoment.format("YYYY-MM-DD HH:mm").toString();
  });
};

/**
 * Finds the first corresponding date in the list.
 * If none found, returns the undefined value.
 * @param date
 * @param listOfDates
 * @returns {*}
 */
var findDate = function (date, listOfDates) {
  return _.find(listOfDates, function (dateFromList) {
    return date.startOf('day').valueOf() === dateFromList.startOf('day').valueOf();
  });
};

/**
 * Creates a new 'exercise node'
 * parentCallbackWhenDoneStateChanges will hold the callback to this node's parent, to be used every time this node's state changes.
 * @param {string} userID
 * @param {string} ID
 * @param {string} type
 * @param {string} parentID
 * @returns {Function}
 */
var exercise = function (userID, ID, type, parentID) {
  // private array, to hold the dates in which this exercise was performed.
  var done = [];
  //private array to hold the children-check-state callback
  var childrenStatesCallbacks = [];
  var childrenRenderCallbacks = [];
  var parentCallbackWhenDoneStateChanges;

  /**
   * The doneStateChanged is an "I've been changed!" shout-out to hand out to the child nodes, for them to call-back.
   * This is the main function, so it will "hold" other functions as its properties.
   * When a child's state changes, it should call this function, which will
   * cause  the parent to check whether it should be marked as done/undone for a certain date.
   */
  var doneStateChanged = function (date, callback) {

    if (!typeFunctions.hasOwnProperty(type)) {
      throw new Error('type value was not one of the type Functions which are supported.');
    }
    var typeFunc = typeFunctions[type];
    var newState = childrenStatesCallbacks[0](date);
    //note that I started from 1, because I used 0 as the default.
    for (var i = 1; i < childrenStatesCallbacks.length; i++) {
      newState = typeFunc(newState, childrenStatesCallbacks[i](date));
    }
    //TODO: replace with a setDoneState function
    if (newState) {
      markAsDone(date, callback);
    } else {
      markAsUndone(date, callback);
    }
  };

  /**
   * function that returns the last status, or optionally, per a certain day.
   * @param date
   * @returns {*}
   */
  var getDoneDates = function (date) {
    if (!done || done.length === 0) {
      return null;
    }
    if (date) {
      return   Boolean(findDate(date, done));
    }
    return maxDate.call(null, done);
  };

  /**
   * register this node's child's "check state" callback.
   * @param callback
   */
  var registerChildStateCallback = function (callback) {
    if (callback) {
      childrenStatesCallbacks.push(callback);
    }
  };

  /**
   * register this node's child's "render" ToRegister.
   * @param callbackToRegister
   */
  var registerParentCallbackWhenDoneStateChanges = function (callbackToRegister) {
    if (callbackToRegister) {
      parentCallbackWhenDoneStateChanges = callbackToRegister;
    }
  };
  var registerChildRenderCallback = function (callback) {
    if (callback) {
      childrenRenderCallbacks.push(callback);
    }
  };

  /**
   * Mark a date as done.
   * @param date
   * @param callback
   */
  var markAsDone = function (date, callback) {
    if (date instanceof Date) {
      date = moment().utc(date).startOf('day');
    }
    if (date && (!findDate(date, done))) {
      done.push(date);

      if (parentID) {
        log("markAsDone calling callback before parentCallbackWhenDoneStateChanges");
        parentCallbackWhenDoneStateChanges(date, function () {
          log("markAsDone calling callback after parentCallbackWhenDoneStateChanges");
          save(callback);
        });
      } else {
        log("markAsDone calling callback, no parentID");
        save(callback);
      }
    } else {
      //else it's already marked, do not mark it.
      log("markAsDone - it's already marked");
      callback(null);
    }
  };

  /**
   * Mark a date as undone, === remove mark
   * @param date
   */
  var markAsUndone = function (date, callback) {
    if (date instanceof Date) {
      date = moment().utc(date).startOf('day');
    }
    if (date) {
      var foundValue = findDate(date, done);
      if (foundValue) {
        done = _.without(done, foundValue);
        if (parentID) {
          parentCallbackWhenDoneStateChanges(date, function () {
            save(callback);
          });
        } else {
          save(callback);
        }
      }
    }
    //else it's not marked, no need to un-mark it.
    callback(null);
  };

  /**
   * get a json string with the exercise data
   * @returns {*}
   */
  var serialize = function () {
    var a = {
      userID: userID,
      name: ID,
      type: type,
      done: serializeDoneList(done),
      parentName: parentID
    };
    var res = JSON.stringify(a);
    var inspect = util.inspect(res);
    logger.logDebug('exercise.js', 191, inspect);
    return  res;
  };

  /**
   * set the exercise data to equal the data from a json string
   * @param exerciseData
   */
  var deserialize = function (exerciseData) {
    var data = JSON.parse(exerciseData);
    var inspect = util.inspect(exerciseData);
    logger.logDebug('exercise.js', 198, inspect);
    userID = data.userID;
    ID = data.name;
    type = data.type;
    done = _.map(data.done, function (doneDateText) {
      return moment.utc(doneDateText);
    });
    parentID = data.parentName;
  };

  var render = function _render(depth, date) {
    var res = { "ID": ID, "type": type, "parentID": getParentID() };
    if (date) {
      res.marked = Boolean(findDate(date, done));
    }
    if (depth >= 1) {
      var lowerDepth = depth - 1;
      res.children = _.map(childrenRenderCallbacks, function (renderFunc) {
        return renderFunc(lowerDepth, date);
      });
    }
    return res;
  };

  var getParentID = function () {
    return parentID;
  };

  var getName = function () {
    return ID;
  };

  var save = function (callback) {
    if (!ID) {
      throw new Error("Trying to save a falsie ID of exercise.");
    }
    var saveExerciseDataCounter = 0;
    repo.saveExerciseData(userID, ID, serialize(), function (err) {
      log('saveExerciseData', ++saveExerciseDataCounter);
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  };

  getDoneDates.deserialize = deserialize;
  getDoneDates.serialize = serialize;
  getDoneDates.registerChildStateCallback = registerChildStateCallback;
  getDoneDates.registerChildRenderCallback = registerChildRenderCallback;
  getDoneDates.registerParentCallbackWhenDoneStateChanges = registerParentCallbackWhenDoneStateChanges;
  getDoneDates.render = render;
  getDoneDates.markAsDone = markAsDone;
  getDoneDates.markAsUndone = markAsUndone;
  getDoneDates.doneStateChanged = doneStateChanged;
  getDoneDates.getName = getName;
  getDoneDates.getParentID = getParentID;
  getDoneDates.save = save;
  return getDoneDates;
};

module.exports = exercise;
