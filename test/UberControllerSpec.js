'use strict';

xdescribe('UberController', function () {
  var $rootScope, Adventures, $scope, createController;
  beforeEach(module('sqrtl'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    Adventures = $injector.get('Adventures');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    // used to create our UberController for testing
    createController = function () {
      return $controller('UberController', {
        $scope: $scope,
        Adventures: Adventures
      });
    };

    createController();
  }));

  it('UberController has method getPrice', function () {
    expect($scope.getPrice).to.be.a('function');
  });

  it('UberController has method findMe', function () {
    expect($scope.findMe).to.be.a('function');
  });

  it('UberController has method getRide', function () {
    expect($scope.getRide).to.be.a('function');
  });

});