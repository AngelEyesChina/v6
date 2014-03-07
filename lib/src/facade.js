/**
 * Created with JetBrains WebStorm.
 * User: Hanan
 * Date: 15/11/13
 * Time: 23:46
 * To change this template use File | Settings | File Templates.
 */
"use strict";

var tree = require("../src/tree.js");
var logger = require('./logger.js');
var log = function _log(text, text2) {
  logger.logDebug('facade.js', null, text + ' ' + text2);
};

var facade = {};
facade.tree = {};
facade.exercise = {};


facade.tree.renderTree = function _renderTree(userID, momentDate, depth, callback) {
  var myTree = tree(userID);
  myTree.loadTree(function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, myTree.render(null, depth, momentDate));
    }
  });
};

facade.tree.addNewTree = function _addNewTree(userID, callback) {
  var myTree = tree(userID);
  myTree(userID, callback);
};

facade.tree.removeTree = function _addNewTree(userID, callback) {
  var myTree = tree(userID);
  myTree.deleteTree(callback);
};


facade.exercise.getExerciseListing = function _getExerciseListing(userID, exerciseID, momentDate, depth, callback) {
  var myTree = tree(userID);
  myTree.loadTree(function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, myTree.render(exerciseID, depth, momentDate));
    }
  });
};

facade.exercise.markExercise = function _markExercise(userID, exerciseID, moment) {
  var myTree = tree(userID);
  myTree.loadTree(function () {
    myTree.markExercise(exerciseID, moment, log);
  });
};

facade.exercise.unmarkExercise = function _markExercise(userID, exerciseID, moment) {
  var myTree = tree(userID);
  myTree.loadTree(function () {
    myTree.unmarkExercise(exerciseID, moment, log);
  });
};

facade.exercise.addNewExercise = function _addNewExercise(userID, title, type, parent, callback) {
  var myTree = tree(userID);
  myTree.addExercise(title, type, parent, callback);
};

facade.exercise.removeExercise = function _addNewExercise(userID, exerciseID) {
  var myTree = tree(userID);
  myTree.removeExercise(exerciseID);
};


module.exports = facade;
