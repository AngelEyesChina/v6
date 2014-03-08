"use strict";

var repo = require("./repository.js");
var exercise = require("./exercise.js");
var _ = require("underscore");
var async = require("async");
var util = require('util');
var common = require("./common.js");

var connectChildWithParent = function (e, exercises) {
  var parentID = e.getParentID();
  if (_.isUndefined(parentID)) {
    return;
  }
  var parent = exercises[parentID];
  if (_.isUndefined(parent)) {
    return;
  }
  parent.registerChildRenderCallback(e.render);
  parent.registerChildStateCallback(e);
  e.registerParentCallbackWhenDoneStateChanges(parent.doneStateChanged);

};
/**
 * Load a whole tree
 */
var loadTreeFlatly = function (userID, exercisesData) {
  var exercises = {};
  //first, load the data itself
  _.each(exercisesData, function (itemData) {
    var e = exercise(userID, null, null, null, null);
    e.deserialize(itemData);
    exercises[e.getID()] = e;
  });

  //second step, register parents and children
  _.forEach(exercises, function (e) {
    connectChildWithParent(e, exercises);
  });
  return exercises;
};


var tree = function (userID) {

  var exercises = {};

  //functions that assume the tree is already loaded

  var render = function _render(exerciseID, depth, date) {
    //assuming the tree has already been loaded
    depth = depth || Infinity;

    if (!exerciseID) {
      var rootNodes = getRootNodes();
      rootNodes.sort(common.sortByDisplayOrderAndID);
      var combined = _.map(rootNodes, function (rootNode) {
        return rootNode.render(depth - 1, date);
      });
      return combined;
    }

    if (!exercises[exerciseID]) {
      throw new Error("'" + exerciseID + "' was not found for user '" + userID + "'");
    }
    return exercises[exerciseID].render(depth, date);
  };

  var removeExercise = function (ID) {
    //assuming the tree has already been loaded
    if (!exercises[ID]) {
      throw new Error("An exercise with this ID doesn't exist for this user.");
    }
    if (getChildren(ID).length > 0) {
      throw new Error('This exercise still has other exercises that depend on it.');
    }
    delete  exercises[ID];
  };

  var addExercise = function (title, type, parentID, callback) {
    //assuming the tree has already been loaded
    if (_.find(exercises, function (item) {
      return title === item.title;
    })) {
      throw new Error('An exercise with this title already exists for this user.');
    }
    var e = exercise(userID, title, type, parentID);
    var ID = e.getID();
    exercises[ID] = e;
    connectChildWithParent(e, exercises);
    e.save(function (err) {
      if (err) {
        callback(err);
      } else {
        callback(null, e);
      }
    });
  };

  var saveTree = function (callback) {
    //assuming the tree has already been loaded
    var serialized = {};
    try {
      _.forEach(exercises, function (exercise) {
        serialized[exercise.getID()] = exercise.serialize();
      });
    }
    catch (e) {
      var err = e.message;
      callback(err, null);
    }
    repo.saveUserData(userID, serialized, callback);
  };

  var markExercise = function _markExercise(exerciseID, date, callback) {
    //assuming the tree has already been loaded
    var exercise = exercises[exerciseID];
    exercise.markAsDone(date, callback);
  };

  var unmarkExercise = function _unmarkExercise(exerciseID, date, callback) {
    //assuming the tree has already been loaded
    var exercise = exercises[exerciseID];
    exercise.markAsUndone(date, callback);
  };


  var getChildren = function (parentID) {
    //assuming the tree has already been loaded
    return _.select(exercises, function (item) {
      return item.getParentID() === parentID;
    });
  };

  var getRootNodes = function () {
    //assuming the tree has already been loaded
    return _.select(exercises, function (item) {
      return (!item.getParentID());
    });
  };


  //functions that do *not* assume the tree is already loaded

  var deleteTree = function (callback) {
    repo.deleteUserData(userID, callback);
  };

  /**
   * loads the tree per a specific userID.
   * @param callback
   */
  var loadTree = function (callback) {
    async.waterfall([
      function stepOneLoadUserData(_next) {
        repo.loadUserData(userID, _next);
      },
      function stepTwoLoadTreeFlatly(data, _next) {
        var e = loadTreeFlatly(userID, data);
        _next(null, e);
      }],
      function (err, res) {
        if (err) {
          callback(err);
        } else {
          exercises = res;
          callback(null);
        }
      });
  };


  //TODO edit exercise
  saveTree.myType='tree';
  saveTree.render = render;
  saveTree.removeExercise = removeExercise;
  saveTree.addExercise = addExercise;
  saveTree.deleteTree = deleteTree;
  saveTree.exercises = exercises;
  saveTree.loadTree = loadTree;
  saveTree.markExercise = markExercise;
  saveTree.unmarkExercise = unmarkExercise;
  //saveTree.getAllKeys = repo.getAllKeys();//TODO: move to a better place
  return saveTree;
};
module.exports = tree;