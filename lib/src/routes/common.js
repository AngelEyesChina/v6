"use strict";

Object.defineProperty(Error.prototype, 'toJSON', {
  value: function () {
    var alt = {};

    Object.getOwnPropertyNames(this).forEach(function (key) {
      alt[key] = this[key];
    }, this);

    return alt;
  },
  configurable: true
});

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

  if (isString(outputToWrite)) {
    body = outputToWrite;
  } else {
    body = JSON.stringify(outputToWrite);
  }
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
};

exports.writeToResponse = writeToResponse;
exports.writeErrorToResponse = writeErrorToResponse;
exports.writeDataToResponse = writeDataToResponse;