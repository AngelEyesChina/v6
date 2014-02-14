'use strict';

angular.module('practiceLogV6App')
  .constant('consts', {
    url: {
      home: '/view',
      view: '/view/{exerciseID}/{displayedDate}',
      new: '/new/parent/'
    },
    rootExerciseID: 'root'
  });
