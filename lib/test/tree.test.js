//
//  Created with JetBrains WebStorm.
//  User: HananW
//  Date: 24/09/13
//  Time: 18:47
//  To change this template use File | Settings | File Templates.
//
"use strict";

var tree = require("../src/tree.js");
var async = require("async");
var repo = require("../src/repository.js");
var moment = require('moment');
var logger = require('../src/logger.js');
var util = require('util');

var consts = {
  USER_ID: "test exercise name",
  EXERCISE_NAME: "test exercise name",
  EXERCISE_TYPE: "AND",
  MARK_DATE: moment.utc("Dec 10, 1976 UTC") //though not exactly a constant
};

var log = function _log(text) {
  logger.logDebug('tree.test.js', null, text);
};


var deleteAllFromTree = function (callback) {
  var myTree = tree(consts.USER_ID);
  myTree.deleteTree(callback);
};

var debugTestFlow = function (callback, msg) {
  log(msg);
  callback();
};

process.env.NODE_ENV = 'test';
log("Tests start");

module.exports = {
  setUp: function (callback) {
//        log("setUp;");
    deleteAllFromTree(callback);
  },

  tearDown: function (callback) {
    // clean up
//        log("tearDown;");
    deleteAllFromTree(callback());
  },

  /*    dummyTest1: function (test) {
   test.equals(1, 1);
   test.done();
   },
   dummyTest2: function (test) {
   test.equals(1, 1);
   test.done();
   },*/

  testSaveAndLoadExerciseData: function (test) {
    log("testSaveAndLoadExerciseData;");
    test.expect(1);
    var myTree;
    var myTreeOtherInstance;
    async.series([
      function (callback) {
        myTree = tree(consts.USER_ID);
        myTree.addExercise(consts.EXERCISE_NAME, consts.EXERCISE_TYPE, null, callback);
      },
      function (callback) {
        myTreeOtherInstance = tree(consts.USER_ID);
        myTreeOtherInstance.loadTree(callback);
      }
    ], function (err) {
      if (err) {
        throw new Error(err);
      }
      var expected = util.inspect(myTree.render(consts.EXERCISE_NAME), { depth: null });
      var actual = util.inspect(myTreeOtherInstance.render(consts.EXERCISE_NAME), { depth: null });
      test.equal(actual, expected, "The type of the exercise should be the same as the other instance's.");
      test.done();
    });
  },

  testMarkExercise: function (test) {
    log('testMarkExercise start');
    test.expect(1);
    var myTree;
    var myTreeOtherInstance;
    async.series([
      function (callback) {
        myTree = tree(consts.USER_ID);
        myTree.addExercise(consts.EXERCISE_NAME, consts.EXERCISE_TYPE, null, callback);
      },
      function (callback) {
        myTree.loadTree(callback);
      },
      function (callback) {
        log("testMarkExercise 2");
        myTree.markExercise(consts.EXERCISE_NAME, consts.MARK_DATE, function () {
          debugTestFlow(callback, "returned from testMarkExercise 2");
        });
      },
      function (callback) {
        log("testMarkExercise 3");
        myTreeOtherInstance = tree(consts.USER_ID);
        myTreeOtherInstance.loadTree(function () {
          debugTestFlow(callback, "returned from testMarkExercise 3");
        });
      }
    ], function (err) {
      log("testMarkExercise 4");
      if (err) {
        throw new Error(err);
      }
      log("testMarkExercise 5");
      var actual = myTreeOtherInstance.render(consts.EXERCISE_NAME, null, consts.MARK_DATE);
      var expected = {"ID": consts.EXERCISE_NAME, "type": consts.EXERCISE_TYPE, "parentID": null, "marked": true, "children": []};
      test.equal(util.inspect(actual, { depth: null }), util.inspect(expected, { depth: null }), "testMarkExercise - the marked exercise didn't render as expected");
      test.done();
    });
  },

  /**
   *                   root1                                                   root2
   *                     +                                                       +
   *        root1Child1<-+->root1Child2                        root2Child1  <----+----->    root2Child2
   *              +                                                 +
   *              |                                                 |
   *              v                                                 |
   *  root1Child1Child1Unmarked      root2Child1Child1Marked <------+---------> root2Child1Child2Marked
   *
   * @param test
   */
  testComplexRender: function (test) {
    test.expect(2);
    var myTree;
    var myTreeOtherInstance;
    async.series([
      function (callback) {
        myTree = tree(consts.USER_ID);
        myTree.addExercise("root1", consts.EXERCISE_TYPE, null, callback);
      }, function (callback) {
        myTree.addExercise("root2", consts.EXERCISE_TYPE, null, callback);
      }, function (callback) {
        myTree.addExercise("root1Child1", consts.EXERCISE_TYPE, "root1", callback);
      }, function (callback) {
        myTree.addExercise("root1Child2", consts.EXERCISE_TYPE, "root1", callback);
      }, function (callback) {
        myTree.addExercise("root2Child1", consts.EXERCISE_TYPE, "root2", callback);
      }, function (callback) {
        myTree.addExercise("root2Child2", consts.EXERCISE_TYPE, "root2", callback);
      }, function (callback) {
        myTree.addExercise("root1Child1Child1Unmarked", consts.EXERCISE_TYPE, "root1Child1", callback);
      }, function (callback) {
        myTree.addExercise("root2Child1Child1Marked", consts.EXERCISE_TYPE, "root2Child1", callback);
      }, function (callback) {
        myTree.addExercise("root2Child1Child2Marked", consts.EXERCISE_TYPE, "root2Child1", callback);
      }, function (callback) {
        myTree.markExercise("root2Child1Child1Marked", consts.MARK_DATE, callback);
      }, function (callback) {
        myTree.markExercise("root2Child1Child2Marked", consts.MARK_DATE, callback);
      }, function (callback) {
        myTreeOtherInstance = tree(consts.USER_ID);
        myTreeOtherInstance.loadTree(callback);
      }
    ], function (err) {
      if (err) {
        throw new Error(err);
      }
      var actual = myTreeOtherInstance.render(null, null, consts.MARK_DATE);
      test.ok(actual.indexOf('root2Child1Child1Marked') !== -1, "Third level child does not exist in output");

//            var expected = "[{\"ID\":\"root2\",\"type\":\"AND\",\"parentID\":null,\"marked\":false,\"children\":[{\"ID\":\"root2Child1\",\"type\":\"AND\",\"marked\":true,\"children\":[{\"ID\":\"root2Child1Child2Marked\",\"type\":\"AND\",\"marked\":true,\"children\":[]},{\"ID\":\"root2Child1Child1Marked\",\"type\":\"AND\",\"marked\":true,\"children\":[]}]},{\"ID\":\"root2Child2\",\"type\":\"AND\",\"marked\":false,\"children\":[]}]},{\"ID\":\"root1\",\"type\":\"AND\",\"marked\":false,\"children\":[{\"ID\":\"root1Child1\",\"type\":\"AND\",\"marked\":false,\"children\":[{\"ID\":\"root1Child1Child1Unmarked\",\"type\":\"AND\",\"marked\":false,\"children\":[]}]},{\"ID\":\"root1Child2\",\"type\":\"AND\",\"marked\":false,\"children\":[]}]}]";
//      var expected = "[{\"ID\":\"root1\",\"type\":\"AND\",\"marked\":false,\"children\":[{\"ID\":\"root1Child1\",\"type\":\"AND\",\"marked\":false,\"children\":[{\"ID\":\"root1Child1Child1Unmarked\",\"type\":\"AND\",\"marked\":false,\"children\":[]}]},{\"ID\":\"root1Child2\",\"type\":\"AND\",\"marked\":false,\"children\":[]}]},{\"ID\":\"root2\",\"type\":\"AND\",\"parentID\":null,\"marked\":false,\"children\":[{\"ID\":\"root2Child1\",\"type\":\"AND\",\"marked\":true,\"children\":[{\"ID\":\"root2Child1Child2Marked\",\"type\":\"AND\",\"marked\":true,\"children\":[]},{\"ID\":\"root2Child1Child1Marked\",\"type\":\"AND\",\"marked\":true,\"children\":[]}]},{\"ID\":\"root2Child2\",\"type\":\"AND\",\"marked\":false,\"children\":[]}]}]";
      var expectedJson = require('./expectedComplexRender.json');
      var expected = util.inspect(expectedJson, { depth: null });
      test.equal(actual, expected, "testComplexRender - The marked exercise didn't render as expected");
      test.done();
    });
  },

  finish: function (test) {
//        log(6);
    test.done();
    repo.close();
    log("Tests end");
  }
};


