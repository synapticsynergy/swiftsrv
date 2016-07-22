describe('Adventures', function () {
  var $httpBackend;
  beforeEach(module('sqrtl.httpRequest'));

  beforeEach(inject(function (_$httpBackend_, _lodash_) {
    $httpBackend = _$httpBackend_;
  }));

  it('exists', function () {
    expect(0).to.be(0);
  });
});

