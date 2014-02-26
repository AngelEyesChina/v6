'use strict';

angular.module('practiceLogApp')
  .controller('CreateCtrl', function ($scope, apiAccess, $window, $routeParams) {
    $scope.save = function () {
      $scope.exercise.parentID = $routeParams.parentID;
      apiAccess.save($scope.exercise, function () {
        $window.history.back();
        $scope.$apply();
        /*$timeout(function () {
         $location.path(newExerciseUrl($scope));
         */
      });
    }
  });
