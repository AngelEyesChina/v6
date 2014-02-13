"use strict";
var tree = require("../tree.js");
var facade = require("../facade.js");
var common = require("./common.js");
var logger = require('../logger.js');


var log = function _log(text) {
  logger.logDebug('user.js', null, text);
};

var userID = 'hanan'; //TODO Hanan: implement PasportJS

/**
 * render tree
 * @param req
 * @param res
 */
exports.get = function (req, res) {
  console.log('user.get called');
  userID = req.params.userID || userID;
  var momentDate = moment.utc(req.params.displayedDate, 'YYYY-MM-DD');

  facade.tree.renderTree(userID, momentDate, function (err, data) {
    if (err) {
      common.writeErrorToResponse(err, res);
    }
    else {
      common.writeDataToResponse(data, res);
    }
  });
};

/**
 * adds a New Tree
 * @param req
 * @param res
 */
exports.add = function (req, res) {
  userID = req.params.userID || userID;


  facade.tree.addNewTree(userID, function (err, result) {
    if (err) {
      common.writeErrorToResponse(err, res);
    }
    else {
      common.writeToResponse(myTree.render(), res);
    }
  });
};
