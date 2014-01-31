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

var writeToResponse = function (outputToWrite, res) {
    var body;

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