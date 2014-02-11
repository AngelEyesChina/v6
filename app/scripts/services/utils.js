'use strict';

angular.module('practiceLogApp')
  .factory('utils', function () {
    // Public API here
    return {
      stringFormat: function (str, col) {
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
    };
  });
