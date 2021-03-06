/*
 check out:
 http://stackoverflow.com/questions/15161349/multiple-routing-urls-for-single-service-angularjs
 http://www.bennadel.com/blog/2433-Using-RESTful-Controllers-In-An-AngularJS-Resource.htm
 */

'use strict';
angular.module('practiceLogApp')
  .factory('apiAccess', ['$resource', function ($resource) {
    return $resource('/api/v/:version/exercise/:listController:id/:docController/:date/',
      {
        version: 1,
        id: '@id',
        listController: '@listController',
        docController: '@docController'
      },{
        get: {
          method: 'GET',
          params: {
            docController: 'show'
          }
        },
        getAll: {
          method: 'GET',
          isArray: true,
          params: {
            listController: 'all'

          }
        },
        markExerciseDone: {
          method: 'POST',
          params: {
            docController: 'markExerciseDone',
            date: '@date'
          }
        },
        markExerciseUndone: {
          method: 'POST',
          params: {
            docController: 'markExerciseUndone',
            date: '@date'
          }
        },
        save:{
          method: 'POST',
          params: {
            listController: 'new'
          }
        }
      });
  }]);
