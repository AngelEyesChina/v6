'use strict';

angular.module('practiceLogApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'View',
      'link': '/view'
    }];
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
