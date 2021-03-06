"use strict";

var redis = require("redis");
var async = require("async");
var logger = require('../src/logger.js');
var config = require("../config/config.js");
var util = require('util');

var log = function _log(text, text2) {
  logger.logDebug('repository.js', null, text + ' ' + text2);
};

var client = redis.createClient(config.redis.port, config.redis.host);

client.on('error', function (err) {
  log("redis error", err);
});


var saveUserData = function (userID, serializedExercises, callback) {
  if (Object.keys(serializedExercises).length > 0) {
    client.hmset(userID, serializedExercises, callback);
  } else {
    client.del(userID, callback);
  }
};

var loadUserData = function (userID, callback) {
  client.hgetall(userID, function (err, b) {
    callback(err, b);
  });
};

/**
 * Saves exercise data to the repository.
 * @param userID
 * @param id
 * @param json
 * @param callback
 */
var saveExerciseData = function (userID, id, json, callback) {
//    log("saveExerciseData;");
  client.hset(userID, id, json, callback);
};

var loadExerciseData = function (userName, id, callback) {
  client.hget(userName, id, function (err, res) {
    if (err) {
      callback(err, res);
    }
    else {
      var val = {};
      try {
        val = JSON.parse(res);
      }
      catch (e) {
        err = e.message;
      }
      finally {
        callback(err, val);
      }
    }
  });
};

var closeConnection = function () {
  client.quit();
};

var deleteUserData = function (userID, callback) {
  client.del(userID, callback);
};

var getAllKeys = function (callback) {
  client.keys("*", callback);
};

// starting "new code" 2014-03-10 ---------------------------
var getUser = function (userID, callback) {
  var userIDKey = config.consts.redisPrefix + userID;
  client.get(userIDKey, callback);
};

var createUser = function _createUser(userID, user, callback) {
  var userIDKey = config.consts.redisPrefix + userID;
  client.set(userIDKey, JSON.stringify(user), callback);
};

module.exports.createUser = createUser;
module.exports.getUser = getUser;
module.exports.getAllKeys = getAllKeys;
module.exports.deleteUserData = deleteUserData;
module.exports.loadExerciseData = loadExerciseData;
module.exports.saveExerciseData = saveExerciseData;
module.exports.loadUserData = loadUserData;
module.exports.saveUserData = saveUserData;
module.exports.close = closeConnection;
