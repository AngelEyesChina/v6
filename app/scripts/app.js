'use strict';

angular.module('practiceLogApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'toggle-switch'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/view', {
        templateUrl: 'partials/view',
        controller: 'ViewCtrl'
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