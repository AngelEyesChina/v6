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
var _ = require("underscore");

var consts = {
  TEST_USER_ID: "test user name",
  TEST_EXERCISE_NAME: "test exercise name",
  TEST_EXERCISE_TYPE: "AND",
  TEST_MARK_DATE: moment.utc("Dec 10, 1976 UTC") //though not exactly a constant
};

var log = function _log(text) {
  logger.logDebug('tree.test.js', null, text);
};


var deleteAllFromTree = function (callback) {
  var myTree = tree(consts.TEST_USER_ID);
  myTree.deleteTree(callback);
};

var debugTestFlow = function (callback, msg) {
  log(msg);
  callback();
};

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
    var ID;
    async.waterfall([
      function (callback) {
        myTree = tree(consts.TEST_USER_ID);
        myTree.addExercise(consts.TEST_EXERCISE_NAME, consts.TEST_EXERCISE_TYPE, null, callback);
      },
      function (exercise, callback) {
        ID = exercise.getID();
        myTreeOtherInstance = tree(consts.TEST_USER_ID);
        myTreeOtherInstance.loadTree(callback);
      }
    ], function (err) {
      if (err) {
        throw new Error(err);
      }
      var expected = util.inspect(myTree.render(ID), { depth: null });
      var actual = util.inspect(myTreeOtherInstance.render(ID), { depth: null });
      test.equal(actual, expected, "The loaded tree should be the same as the original.");
      test.done();
    });
  },

  testMarkExercise: function (test) {
    log('testMarkExercise start');
    test.expect(1);
    var myTree;
    var myTreeOtherInstance;
    var ID;
    async.waterfall([
      function (callback) {
        myTree = tree(consts.TEST_USER_ID);
        myTree.addExercise(consts.TEST_EXERCISE_NAME, consts.TEST_EXERCISE_TYPE, null, callback);
      },
      function (exercise, callback) {
        myTree.loadTree(callback);
        ID = exercise.getID();
      },
      function (callback) {
        log("testMarkExercise 2");
        myTree.markExercise(ID, consts.TEST_MARK_DATE, function () {
          debugTestFlow(callback, "returned from testMarkExercise 2");
        });
      },
      function (callback) {
        log("testMarkExercise 3");
        myTreeOtherInstance = tree(consts.TEST_USER_ID);
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
      var actual = myTreeOtherInstance.render(ID, null, consts.TEST_MARK_DATE);
      var expected = {'ID': ID, 'title': consts.TEST_EXERCISE_NAME, 'type': consts.TEST_EXERCISE_TYPE, 'parentID': null, 'marked': true, 'lastNDates': [moment(consts.TEST_MARK_DATE).toISOString()], 'children': []};
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
  testComplexSaveAndLoad: function (test) {
    test.expect(4);
    var myTree;
    var myTreeOtherInstance;
    var ID = [];
    async.waterfall([
      function (callback) {
        myTree = tree(consts.TEST_USER_ID);
        myTree.addExercise("root1", consts.TEST_EXERCISE_TYPE, null, callback);
      }, function (e, callback) {
        ID.root1 = e.getID();
        myTree.addExercise("root2", consts.TEST_EXERCISE_TYPE, null, callback);
      }, function (e, callback) {
        ID.root2 = e.getID();
        myTree.addExercise("root1Child1", consts.TEST_EXERCISE_TYPE, ID.root1, callback);
      }, function (e, callback) {
        ID.root1Child1 = e.getID();
        myTree.addExercise("root1Child2", consts.TEST_EXERCISE_TYPE, ID.root1, callback);
      }, function (e, callback) {
        ID.root1Child2 = e.getID();
        myTree.addExercise("root2Child1", consts.TEST_EXERCISE_TYPE, ID.root2, callback);
      }, function (e, callback) {
        ID.root2Child1 = e.getID();
        myTree.addExercise("root2Child2", consts.TEST_EXERCISE_TYPE, ID.root2, callback);
      }, function (e, callback) {
        ID.root2Child2 = e.getID();
        myTree.addExercise("root1Child1Child1Unmarked", consts.TEST_EXERCISE_TYPE, ID.root1Child1, callback);
      }, function (e, callback) {
        ID.root1Child1Child1Unmarked = e.getID();
        myTree.addExercise("root2Child1Child1Marked", consts.TEST_EXERCISE_TYPE, ID.root2Child1, callback);
      }, function (e, callback) {
        ID.root2Child1Child1Marked = e.getID();
        myTree.addExercise("root2Child1Child2Marked", consts.TEST_EXERCISE_TYPE, ID.root2Child1, callback);
      }, function (e, callback) {
        ID.root2Child1Child2Marked = e.getID();
        myTree.markExercise(ID.root2Child1Child2Marked, consts.TEST_MARK_DATE, callback);
      }, function (callback) {
        myTree.markExercise(ID.root2Child1Child2Marked, consts.TEST_MARK_DATE, callback);
      }, function (callback) {
        myTreeOtherInstance = tree(consts.TEST_USER_ID);
        myTreeOtherInstance.loadTree(callback);
      }
    ], function (err) {
      if (err) {
        throw new Error(err);
      }
      var actual = myTreeOtherInstance.render(null, null, consts.TEST_MARK_DATE);

      var root2 = _.findWhere(actual, {title: 'root2'});
      test.ok(root2, "root level item does not exist in output");
      var root2Child1 = _.findWhere(root2.children, {title: 'root2Child1'});
      test.ok(root2Child1, "Second level child does not exist in output");
      var root2Child1Child1Marked = _.findWhere(root2Child1.children, {title: 'root2Child1Child1Marked'});
      test.ok(root2Child1Child1Marked, "Third level child does not exist in output");

      //TODO: hanan delete expectedComplexRender.json
      //var expected = require('./expectedComplexRender.json');
      var expected = myTree.render(null, null, consts.TEST_MARK_DATE);
      test.equal(util.inspect(actual, { depth: null }), util.inspect(expected, { depth: null }), "testComplexRender - The marked exercise didn't render as expected");
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


