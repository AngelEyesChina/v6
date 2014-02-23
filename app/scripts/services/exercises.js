'use strict';

angular.module('practiceLogApp')
  .factory('Exercises', ['$resource', function ($resource) {
    return $resource('/exercises/:exerciseID/date/:displayedDate',
    {
    }, {
        mark: {
         method: 'POST',
         params: { id: '@id', date: '@date' },
         isArray: false
         }
/*    , method2: { ... }*/
    });
  }]);
