"use strict";

var repo = require("./repository.js");

var getUser = function _getUser(userID, callback) {  
  repo.getUser(userID, function (err, user) {
    if (err) {
      callback(err);
    } else {
      if (user) {
        callback(null, JSON.parse(user));
      } else {
        callback(null, null);
      }

    }
  });
};


var createUser = function _createUser(userID, user, callback) {
  repo.createUser(userID, user, callback);
};

module.exports.getUser = getUser;
module.exports.createUser = createUser;