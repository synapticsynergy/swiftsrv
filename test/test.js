xdescribe('Routing', function () {
  var $state;
  beforeEach(module('sqrtl'));

  beforeEach(inject(function ($injector) {
    $state = $injector.get('$state');
  }));

  it('Should have /uber route, template, and controller', function () {
    expect($state.states['/uber']).to.be.defined;
    expect($state.states['/uber'].controller).to.equal('UberController');
    expect($state.states['/uber'].templateUrl).to.equal('app/uber/uber.html');
  });

});

