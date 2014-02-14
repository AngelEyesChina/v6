'use strict';
function _stringFormat(str, col) {
  col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);

  return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
    if (m == "{{") {
      return "{";
    }
    if (m == "}}") {
      return "}";
    }
    return col[n];
  });
}
angular.module('practiceLogApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'toggle-switch'
  ])
  .config(function ($provide, $routeProvider, $locationProvider, consts) {
    $provide.factory('utils', function () {
      // Public API here
      return {
        stringFormat: _stringFormat
      };
    });
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/view', {
        redirectTo: function () {
          return _stringFormat(consts.url.view, {
            exerciseID: consts.rootExerciseID,
            displayedDate: moment.utc().format('YYYY-MM-DD')
          });
        }

      })
      .when('/view/:exerciseID/:displayedDate', {
        templateUrl: 'partials/view',
        controller: 'ViewCtrl'
      })
      .when('/view/:exerciseID', {
        templateUrl: 'partials/view',
        controller: 'ViewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });