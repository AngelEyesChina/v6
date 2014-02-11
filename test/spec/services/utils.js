'use strict';

describe('Service: utils', function () {

  // load the service's module
  beforeEach(module('practiceLogApp'));

  // instantiate service
  var utils;
  beforeEach(inject(function (_utils_) {
    utils = _utils_;
  }));

  it('should do something', function () {
    expect(!!utils).toBe(true);
  });

  it("should format a string by the parameters' order", function () {
    expect(utils.stringFormat('{4}1{3}2{2}3{1}4{0}', 'a', 'b', 'c', 'd', 'e')).toBe('e1d2c3b4a');
  });

  it('should format a string by named parameters', function () {
    expect(utils.stringFormat('i can speak {language} since i was {age}', {language: 'javascript', age: 10})
      .toBe('i can speak javascript since i was 10'));
  });
});
