'use strict';
//TODO hanan : check if this file is still needed
// Look at:
// http://adamalbrecht.com/2013/10/30/auto-save-your-model-in-angular-js-with-watch-and-debounce/
// and
// https://gist.github.com/adamalbrecht/7226278


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
/*
angular.module('practiceLogApp', []).factory('$debounce', function($timeout, $q) {
  return function(func, wait, immediate) {
    var timeout;
    var deferred = $q.defer();
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if(!immediate) {
          deferred.resolve(func.apply(context, args));
          deferred = $q.defer();
        }
      };
      var callNow = immediate && !timeout;
      if ( timeout ) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(later, wait);
      if (callNow) {
        deferred.resolve(func.apply(context,args));
        deferred = $q.defer();
      }
      return deferred.promise;
    };
  };
});*/
