'use strict';

angular.module('practiceLogApp')
  .directive('backButton', function () {
    return { //code from http://stackoverflow.com/a/17099325/532517
      restrict: 'A',

      link: function (scope, element, attrs) {
        element.bind('click', goBack);

        function goBack() {
          history.back();
          scope.$apply();
        }
      }
    };
  });
