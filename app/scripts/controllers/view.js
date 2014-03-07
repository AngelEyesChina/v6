'use strict';

function newExerciseUrl($scope, consts) {
  if (typeof $scope !== 'undefined') {
    var IDForUrl = $scope.exercise.ID || '';
    return consts.url.new + IDForUrl;
  }
  return null;
}

function setRootDisplay($scope, apiAccess) {
  var rootExercises = apiAccess.getAll({date: $scope.displayedDate});
  $scope.exercise = {};
  $scope.exercise.children = rootExercises;
}

function setChildDisplay($scope, apiAccess) {
  $scope.exercise = apiAccess.get({id: $scope.exerciseID, date: $scope.displayedDate});
}

function setDisplay($scope, apiAccess, consts) {
  if ($scope.exerciseID === consts.rootExerciseID) {
    setRootDisplay($scope, apiAccess);
  } else {
    setChildDisplay($scope, apiAccess);
  }
}

function getParamsOtherwiseRedirect($routeParams, $location, $scope, utils, consts) {
  if (typeof  $routeParams.exerciseID === 'undefined') {
    $scope.$apply($location.path(utils.stringFormat(consts.url.view, {
      exerciseID: consts.rootExerciseID,
      displayedDate: $routeParams.displayedDate
    })).replace());

  }
  $scope.exerciseID = $routeParams.exerciseID;
  var dateFromUrl = moment.utc($routeParams.displayedDate, 'YYYY-MM-DD');
  if (dateFromUrl.isValid()) {
    $scope.displayedDate = dateFromUrl.format('YYYY-MM-DD');
  } else {
    $scope.$apply($location.path(utils.stringFormat(consts.url.view, {
      exerciseID: consts.rootExerciseID,
      displayedDate: moment.utc().format('YYYY-MM-DD')
    })).replace());

  }
}


function ViewCtrl($scope, $location, $timeout, $routeParams, utils, consts, apiAccess) {
  getParamsOtherwiseRedirect($routeParams, $location, $scope, utils, consts);
  setDisplay($scope, apiAccess, consts);
  $scope.newExerciseUrl = function () {
    newExerciseUrl($scope, consts);
  };

  $scope.switchToNewExercisePage = function () {
    $timeout(function () {
      $location.path(newExerciseUrl($scope, consts));
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

  $scope.save = function (exercise) {
    var method = exercise.marked ? apiAccess.markExerciseDone : apiAccess.markExerciseUndone;
    method({id: exercise.ID, date: $scope.displayedDate});
  };

  $scope.dateRelativeToDisplayedDate = function (date) {
    if (date) {
      return moment.utc(date).from($scope.displayedDate);
    }
    return null;
  };

  $scope.doneInLastNDays = function _doneInLastNDays(exercise, n) {
    if (exercise.lastNDates.length === 0) return false;
    var lastDoneDate = moment.utc(exercise.lastNDates[0]);
    var dd = moment.utc($scope.displayedDate);
    return lastDoneDate.diff(dd, 'days') < n;
  };
}

angular.module('practiceLogApp').controller('ViewCtrl', ViewCtrl);

