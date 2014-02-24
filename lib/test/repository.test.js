/**
 * Created with JetBrains WebStorm.
 * User: Hanan
 * Date: 21/09/13
 * Time: 20:16
 * To change this template use File | Settings | File Templates.
 */
/*
exports.testSaveExerciseData = function (test) {
    "use strict";

    var async = require("async");
    var repo = require("../src/repository.js");

    var USER_ID = "test user id";
    var EXERCISE_NAME = "test exercise name";
    var EXERCISE_TYPE = "test exercise type";

    test.expect(3);

    async.series([
        function (callback) {
            repo.saveExerciseData(USER_ID, EXERCISE_NAME, EXERCISE_TYPE, [], null, callback);
        },
        function (callback) {
            repo.loadExerciseData(USER_ID, EXERCISE_NAME, callback);
        }],
        function (err, results) {
            if (err) {
                throw  err;
            }
            console.log(JSON.stringify(results));
            test.equal(results[1].type, EXERCISE_TYPE, "Type was not the same");
            test.equal(results[1].parentName, null, "parentName was not null");
            test.equal(results[1].doneList.length , 0, "doneList was not an empty string");
            test.done();
            repo.close();
        });
};
*/