'use strict';

describe('Service: apiAccess', function () {

  // load the service's module
  beforeEach(module('practiceLogApp'));

  // instantiate service
  var apiAccess;
  beforeEach(inject(function (_apiAccess_) {
    apiAccess = _apiAccess_;
  }));

  it('should do something', function () {
    expect(!!apiAccess).toBe(true);
  });

});
