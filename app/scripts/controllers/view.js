'use strict';

//todo hanan: move to service of type constant
var consts = {
  url: {
    home: '/view',
    view: '/view/{exerciseID}/{displayedDate}',
    new: '/new/parent/'
  },
  rootExerciseID: 'root'
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

function setChildDisplay($scope, Exercises) {
  $scope.exercise = Exercises.get({exerciseID: $scope.exerciseID});
}

function setDisplay($scope, Exercises) {
  if ($scope.exerciseID === consts.rootExerciseID) {
    setRootDisplay($scope, Exercises);
  } else {
    setChildDisplay($scope, Exercises);
  }
}

function getParamsOtherwiseRedirect($routeParams, $location, $scope, utils) {
  if (typeof  $routeParams.exerciseID === 'undefined') {
    $location.path(utils.stringFormat(consts.url.view, {
      exerciseID: consts.rootExerciseID,
      displayedDate: $routeParams.displayedDate
    }));
    return;
  }
  $scope.exerciseID = $routeParams.exerciseID;
  var dateFromUrl = moment.utc($routeParams.displayedDate, 'YYYY-MM-DD');
  if (dateFromUrl.isValid()) {
    $scope.displayedDate = dateFromUrl.format('YYYY-MM-DD');
  } else {
    $location.path(utils.stringFormat(consts.url.view, {
      exerciseID: consts.rootExerciseID,
      displayedDate: moment.utc().format('YYYY-MM-DD')
    }));
  }
}

function ViewCtrl($scope, Exercises, $location, $timeout, $routeParams, utils) {
  getParamsOtherwiseRedirect($routeParams, $location, $scope, utils);
  setDisplay($scope, Exercises);
  $scope.newExerciseUrl = function () {
    newExerciseUrl($scope);
  };

  $scope.switchToNewExercisePage = function () {
    $timeout(function () {
      $location.path(newExerciseUrl($scope));
    });
  };

  $scope.zoomUpUrl = function () {
    var params = {
      displayedDate: $scope.displayedDate
    };
    if (typeof  $scope.exercise.parentID === 'undefined') {
      params.exerciseID = consts.rootExerciseID;
    } else {
      params.exerciseID = $scope.exercise.parentID;
    }
    return utils.stringFormat(consts.url.view, params);
  };

  $scope.drillDownUrl = function (exerciseID) {
    return utils.stringFormat(consts.url.view, {exerciseID: exerciseID, displayedDate: $scope.displayedDate });
  };
}

angular.module('practiceLogApp').controller('ViewCtrl', ViewCtrl);