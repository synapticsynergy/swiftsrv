'use strict';

describe('FormController', function () {
  var $rootScope, Adventures, $scope, $state,
  createController;
  beforeEach(module('sqrtl'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    Adventures = $injector.get('Adventures');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    // used to create our AdventureController for testing
    createController = function () {
      return $controller('FormController', {
        $scope: $scope,
        $state: $state,
        Adventures: Adventures
      });
    };

    createController();
  }));

  it('FormController has method getLocationAndCategory', function () {
    expect($scope.getLocationAndCategory).to.be.a('function');
  });

  it('FormController has method findMe', function () {
    expect($scope.findMe).to.be.a('function');
  });

  it('FormController has method reverseGeocode', function () {
    expect($scope.reverseGeocode).to.be.a('function');
  });

});