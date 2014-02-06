'use strict';

describe('Service: Exercises', function () {

  // load the service's module
  beforeEach(module('practiceLogApp'));

  // instantiate service
  var Exercises;
  beforeEach(inject(function (_Exercises_) {
    Exercises = _Exercises_;
  }));

  it('should do something', function () {
    expect(!!Exercises).toBe(true);
  });

});
