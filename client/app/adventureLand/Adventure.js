angular.module('sqrtl.adventure', ["ngTouch"])

.controller('AdventureController', function($scope, $location, Adventures, $window, LocationFactory) {

  $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];
  var distance = LocationFactory.findDistance($scope.data.location.coordinate);
  distance? $scope.distance = distance + 'km' : $scope.distance = undefined;

  $scope.moreDetails = function(){
    $window.location.href = $scope.data.url;
  };

  $scope.getNew = function(){
    Adventures.dataShift();
    $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];
    var distance = LocationFactory.findDistance($scope.data.location.coordinate);
    distance? $scope.distance = distance + 'km' : $scope.distance = undefined;
  };

  $scope.getUber = function(location){
    console.log("location coords ", location);
    window.localStorage.setItem('latitude', location.latitude.toString());
    window.localStorage.setItem('longitude', location.longitude.toString());
    Adventures.getUber()
    .then(function(response){
      console.log("redirect URL ", response);
      $window.location.href = response;
    });
  };

  $scope.address = {
    long: $scope.data.location.coordinate.longitude,
    lat: $scope.data.location.coordinate.latitude,
    templateUrl: 'http://maps.google.com/maps?q=' + $scope.data.location.coordinate.latitude + ',' + $scope.data.location.coordinate.longitude
  };

  $scope.googleRedirect = function(){
    console.log($scope.address.templateUrl);
    $window.location.href = $scope.address.templateUrl;
  };
  //http://maps.google.com/maps?q=24.197611,120.780512


});



