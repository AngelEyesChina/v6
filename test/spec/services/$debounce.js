'use strict';

describe('Service: $debounce', function () {

  // load the service's module
  beforeEach(module('practiceLogApp'));

  // instantiate service
  var $debounce;
  beforeEach(inject(function (_$debounce_) {
    $debounce = _$debounce_;
  }));

  it('should do something', function () {
    expect(!!$debounce).toBe(true);
  });

});
