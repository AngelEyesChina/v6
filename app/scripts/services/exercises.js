'use strict';

angular.module('practiceLogApp')
  .factory('Exercises', ['$resource', function ($resource) {
    return $resource('/exercises/:exerciseID/',
    {
    }, {
        /*loan: {
         method: 'PUT',
         params: { bookId: '@bookId' },
         isArray: false
         }
    , method2: { ... } */
    });
  }]);