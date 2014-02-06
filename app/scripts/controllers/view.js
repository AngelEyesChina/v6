'use strict';

var consts = {
  url: {
    home: '/view',
    view: '/view/',
    new: '/new/parent/'
  }
};

function newExerciseUrl($scope) {
  if (typeof $scope !== 'undefined') {
    var IDForUrl = $scope.exercise.ID || '';
    return consts.url.new + IDForUrl;
  }
  return null;
}

function setRootDisplay($scope, Exercises) {
  var rootExercises = Exercises.query();
  $scope.exercise = {};
  $scope.exercise.children = rootExercises;
}

function setChildDisplay($scope, Exercises, exerciseID) {
  $scope.exercise = Exercises.get({exerciseID: exerciseID});
}

function setDisplay(exerciseID, $scope, Exercises) {
  if (typeof  exerciseID === 'undefined') {
    setRootDisplay($scope, Exercises);
  } else {
    setChildDisplay($scope, Exercises, exerciseID);
  }
}

function ViewCtrl($scope, Exercises, $location, $timeout, $routeParams) {
  setDisplay($routeParams.exerciseID, $scope, Exercises);

  $scope.newExerciseUrl = function () {
    newExerciseUrl($scope);
  };

  $scope.switchToNewExercisePage = function () {
    $timeout(function () {
      $location.path(newExerciseUrl($scope));
    });
  };

  $scope.zoomUpUrl = function () {
    if (typeof  $scope.exercise.parentID === 'undefined') {
      return consts.url.home;
    } else {
      return consts.url.view + $scope.exercise.parentID;
    }
  };

  $scope.drillDownUrl = function (exerciseID) {
    return consts.url.view + exerciseID;
  };
}

angular.module('practiceLogApp').controller('ViewCtrl', ViewCtrl);