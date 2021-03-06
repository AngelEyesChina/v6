"use strict";
var tree = require("../tree.js");
var facade = require("../facade.js");

var logger = require('../logger.js');
var moment = require('moment');

var util = require('util');

var log = function _log(text) {
  logger.logDebug('api.js', null, text);
};

var isString = function (myVar) {
  return (typeof myVar === 'string' || myVar instanceof String);
};

var writeErrorToResponse = function (outputToWrite, res) {
  writeToResponse(outputToWrite, res, 'error');
};

var writeDataToResponse = function (outputToWrite, res) {
  writeToResponse(outputToWrite, res, 'data');
};

var writeToResponse = function (outputToWrite, res, optionalLog) {
  var body;
  if (optionalLog) {
    console.log('API returning ' + optionalLog + ': ' + outputToWrite);
  }

/*  if (isString(outputToWrite)) {*/
    body = outputToWrite;
  /*} else {
    body = util.inspect(outputToWrite, {depth: null});
  }*/
  res.type('application/json');
  res.json(body);
  //res.setHeader('Content-Length', body.length);
  //res.end(body);
};

var userID = 'hanan'; //TODO: implement PasportJS

/**
 * exercise listing.
 * @param req
 * @param res
 */
exports.getExerciseListing = function (req, res) {
  userID = req.params.userID || userID;
  var exerciseID = req.params.exerciseID;
  var momentDate = moment.utc(req.params.displayedDate, 'YYYY-MM-DD');
  facade.exercise.getExerciseListing(userID, exerciseID, momentDate, 1, function (err, data) {
    if (err) {
      log(err);
      writeErrorToResponse(err, res);
    } else {
      writeDataToResponse(data, res);
    }
  });
};

/**
 * add a new exercise to a tree
 * @param req
 * @param res
 */
exports.addNewExercise = function (req, res) {
  /*
   userID = req.params.userID || userID;
   var exerciseID = req.params.exerciseID;
   var parentID = req.params.parentID === 'null' ? null : req.params.parentID;
   var type = req.params.type;
   */
  debugger;
  userID = req.body.userID || userID;
  var exerciseID = req.body.exerciseID;
  var parentID = req.body.parentID || req.params.parentID;
  var type = req.body.type;

  if (!(userID && exerciseID)) {
    var err = { message: 'parameter missing.'};
    writeToResponse(err, null);
    return;
  }
  facade.exercise.addNewExercise(userID, exerciseID, type, parentID, function (err, result) {
    if (err) {
      writeToResponse(err, res, 'error');
    } else {
      writeToResponse(result.render(), res);
    }
  });
};

/**
 * render tree
 * @param req
 * @param res
 */
exports.renderTree = function (req, res) {
  userID = req.params.userID || userID;
  var momentDate = moment.utc(req.params.displayedDate, 'YYYY-MM-DD');

  facade.tree.renderTree(userID, momentDate, 1, function (err, data) {
    if (err) {
      writeErrorToResponse(err, res);
    }
    else {
      writeDataToResponse(data, res);
    }
  });
};

/**
 * adds a New Tree
 * @param req
 * @param res
 */
var addNewTree = function (req, res) {
  userID = req.params.userID || userID;


  facade.tree.addNewTree(userID, function (err, result) {
    if (err) {
      writeErrorToResponse(err, res);
    }
    else {
      writeToResponse(myTree.render(), res);
    }
  });
};


/* *****************************************************************************************************************************
 * From hence forth are api in the format:
 * '/api/v/:version/exercise/:listController:id/:docController'
 ***************************************************************************************************************************** */


/**
 * mark an exercise as done
 * @param req
 * @param res
 */
exports.markExerciseDone = function (req, res) {
  markDoneOrUndoneHelper(true, req, res);
};

//app.get('/unmark/user/:userID/get/:exerciseID/date/:year/:month/day', exercise.mark);
exports.markExerciseUndone = function (req, res) {
  markDoneOrUndoneHelper(false, req, res);
};

var markDoneOrUndoneHelper = function (isDone, req, res) {
  userID = req.params.userID || userID;
  var exerciseID = req.params.exerciseID;
  var momentDate = moment.utc(req.params.date, 'YYYY-MM-DD');
  if (isDone) {
    facade.exercise.markExercise(userID, exerciseID, momentDate);
  } else {
    facade.exercise.unmarkExercise(userID, exerciseID, momentDate);
  }
};

