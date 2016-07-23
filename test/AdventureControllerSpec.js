'use strict';

describe('AdventureController', function () {
  var $rootScope, Adventures, $scope, $location, $window,
  createController;
  beforeEach(module('sqrtl'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    Adventures = $injector.get('Adventures');
    $window = $injector.get('$window');
    $scope = $rootScope.$new();
    window.localStorage.setItem('data', JSON.stringify([{location: {coordinate: {latitude : 37, longitude: -122}}}]));

    var $controller = $injector.get('$controller');

    // used to create our AdventureController for testing
    createController = function () {
      return $controller('AdventureController', {
        $scope: $scope,
        $location: $location,
        Adventures: Adventures,
        $window: $window
      });
    };

    createController();
  }));


  it('$scope.data and $scope.address should exist', function () {
    expect($scope.data).to.exist;
    expect($scope.address).to.exist;
  });

  it('Adventures has method getNew', function () {
    expect($scope.getNew).to.be.a('function');
  });

  it('Adventures has method getUber', function () {
    expect($scope.getUber).to.be.a('function');
  });

  it('Adventures has method googleRedirect', function () {
    expect($scope.googleRedirect).to.be.a('function');
  });

});