"use strict";

var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json');

var errorLog = log4js.getLogger('errorLog');
var mainLog = log4js.getLogger('mainLog');
var inLog = log4js.getLogger('inLog');
var outLog = log4js.getLogger('outLog');


var writeToLog = function _writeToLog(logFunction, text) {
  var textString = text;
  if (typeof(textString) !== "string") {
    textString = text.toString();
  }
  logFunction(textString);
};

var writeToLogFormattedLine = function _writeToLogFormattedLine(logFunction, filename, line, text) {
    if (Array.isArray(text)) {
        text = text.join('; ');
    }
    writeToLog(logFunction, " in file: " + filename + " at line number " + line + ", Log line: " + text);
};

var logger = {};
logger.logError = function (filename, line, text) {
    writeToLogFormattedLine(function (text) {
        errorLog.error(text);
    }, filename, line, text);
};

logger.logWarning = function (filename, line, text) {
    writeToLogFormattedLine(function (text) {
        errorLog.warn(text);
    }, filename, line, text);
};

logger.logDebug = function (filename, line, text) {
    /*  example for a on-the-fly lazy variable (with bind)
     if(typeof this.debugFunc === 'undefined'){
     this.debugFunc = mainLog.debug.bind(mainLog);
     }
     */
    writeToLogFormattedLine(function (text) {
        mainLog.debug(text);
    }, filename, line, text);
};

logger.logInfo = function (text) {
    writeToLog(function (text) {
        mainLog.info(text);
    }, text);
};


logger.logInput = function (text) {
    writeToLog(function (text) {
        inLog.info(text);
    }, text);
};

logger.logOutput = function (text) {
    writeToLog(function (text) {
        outLog.info(text);
    }, text);
};

if (logger.__stack === undefined) {
    Object.defineProperty(logger, '__stack', {
        get: function getFunction() {
            var orig = Error.prepareStackTrace;
            Error.prepareStackTrace = function (_, stack) {
                return stack;
            };
            var err = new Error();
            Error.captureStackTrace(err, getFunction);
            var stack = err.stack;
            Error.prepareStackTrace = orig;
            return stack;
        }
    });
}

if (logger.__line === undefined) {
    Object.defineProperty(logger, '__line', {
        get: function () {
            return __stack[1].getLineNumber();
        }
    });
}
module.exports = logger;