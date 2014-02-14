'use strict';

angular.module('practiceLogApp')
  .constant('consts', {
    url: {
      home: '/view',
      view: '/view/{exerciseID}/{displayedDate}',
      new: '/new/parent/'
    },
    rootExerciseID: 'root'
  });
