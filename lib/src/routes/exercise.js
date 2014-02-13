/**
 * Created with JetBrains WebStorm.
 * User: Hanan
 * Date: 20/09/13
 * Time: 16:44
 * To change this template use File | Settings | File Templates.
 */
"use strict";

var tree = require("../tree.js");
var facade = require("../facade.js");
var common = require("./common.js");
var logger = require('../logger.js');
var moment = require('moment');

var log = function _log(text) {
  logger.logDebug('exercise.js', null, text);
};

var userID = 'hanan'; //TODO: implement PasportJS


/**
 * exercise listing.
 * @param req
 * @param res
 */
exports.get = function (req, res) {
  debugger;
  console.log('exercise.get called');
  userID = req.params.userID || userID;
  var exerciseID = req.params.exerciseID;
  var momentDate = moment.utc(req.params.displayedDate, 'YYYY-MM-DD');

  facade.exercise.getExerciseListing(userID, exerciseID, momentDate, function (err, data) {
    if (err) {
      log(err);
      common.writeErrorToResponse(err, res);
    } else {
      common.writeDataToResponse(data, res);
    }
  });
};

/**
 * mark an exercise as done
 * @param req
 * @param res
 */
//app.get('/mark/user/:userID/get/:exerciseID/date/:year/:month/day', exercise.mark);
exports.mark = function (req, res) {
  markDoneOrUndoneHelper(true, req, res);
};

//app.get('/unmark/user/:userID/get/:exerciseID/date/:year/:month/day', exercise.mark);
exports.unmark = function (req, res) {
  markDoneOrUndoneHelper(false, req, res);
};

var markDoneOrUndoneHelper = function (isDone, req, res) {
  userID = req.params.userID || userID;
  var exerciseID = req.params.exerciseID;
  var year = req.params.year;
  var month = req.params.month;
  var day = req.params.day;
  var moment = moment.utc(year + "-" + month + "-" + day + " UTC");
  if (isDone) {
    facade.exercise.markExercise(userID, exerciseID, moment);
  } else {
    facade.exercise.unmarkExercise(userID, exerciseID, moment);
  }
};


/**
 * add a new exercise to a tree
 * @param req
 * @param res
 */
exports.add = function (req, res) {
  /*
   userID = req.params.userID || userID;
   var exerciseID = req.params.exerciseID;
   var parentID = req.params.parentID === 'null' ? null : req.params.parentID;
   var type = req.params.type;
   */
  userID = req.body.userID || userID;
  var exerciseID = req.body.exerciseID;
  var parentID = req.body.parentID || req.params.parentID;
  var type = req.body.type;

  if (!(userID && exerciseID)) {
    var err = { message: 'parameter missing.'};
    common.writeToResponse(err, null);
    return;
  }
  facade.exercise.addNewExercise(userID, exerciseID, type, parentID, function (err, result) {
    if (err) {
      common.writeToResponse(err, res, 'error');
    } else {
      common.writeToResponse(result.render(), res);
    }
  });
};


