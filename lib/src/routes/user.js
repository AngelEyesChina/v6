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
  userID = req.params.userID || userID;

  facade.tree.renderTree(userID, function (err, data) {
    if (err) {
      console.log(err);
      common.writeToResponse(err, res);
    }
    else {
      common.writeToResponse(data, res);
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
      console.log(err);
      common.writeToResponse(err, res);
    }
    else {
      common.writeToResponse(myTree.render(), res);
    }
  });
};
