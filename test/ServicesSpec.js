describe('Adventures Factory', function () {
  var $httpBackend, Adventures;
  beforeEach(module('sqrtl.httpRequest'));

  afterEach(inject(function ($httpBackend) {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    Adventures = $injector.get('Adventures');
  }));

  it('Adventures factory should exist', function () {
    expect(Adventures).to.exist;
  });

  it('Adventures has method requestAdventures', function () {
    expect(Adventures.requestAdventures).to.be.a('function');
  });

  it('Adventures has method dataShift', function () {
    expect(Adventures.dataShift).to.be.a('function');
  });

  it('Adventures has method getUber', function () {
    expect(Adventures.getUber).to.be.a('function');
  });

  it('should send back response with getUber', function () {
      var mockResponse =
        { authorized: "signed in!"
        };

      $httpBackend.expect('GET', '/api/getUber').respond(mockResponse);

      Adventures.getUber().then(function (resp) {
        expect(resp).to.deep.equal(mockResponse);
      });

      $httpBackend.flush();
  });

  it('Adventures has method uberPrice', function () {
    expect(Adventures.uberPrice).to.be.a('function');
  });

  it('Adventures has method uberRide', function () {
    expect(Adventures.uberRide).to.be.a('function');
  });

  it('Adventures has method geoFindMe', function () {
    expect(Adventures.geoFindMe).to.be.a('function');
  });

});

