angular.module('sqrtl.adventure', ["ngTouch"])

.controller('AdventureController', function($scope, $location, Adventures, $window, LocationFactory) {
  //variable assignments
  /**************************/

  //sets the scope data from local storage
  $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];

  //gets distance to venue and formats it to kilometers,
  //it will not render to the page if the distance isnt availible
  var distance = LocationFactory.findDistance($scope.data.location.coordinate);
  distance? $scope.distance = distance + 'km' : $scope.distance = undefined;

  //assigns the coordinates and google maps url
  $scope.address = {
    long: $scope.data.location.coordinate.longitude,
    lat: $scope.data.location.coordinate.latitude,
    templateUrl: 'http://maps.google.com/maps?q=' + $scope.data.location.coordinate.latitude + ',' + $scope.data.location.coordinate.longitude
  };

  //$scope method assignments
  /**************************/

  //gets new data from localstorage when a new venue is requested
  $scope.getNew = function(){
    Adventures.dataShift();
    $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];
    var distance = LocationFactory.findDistance($scope.data.location.coordinate);
    distance? $scope.distance = distance + 'km' : $scope.distance = undefined;
  };

  //requsts uber with you coordinates and then redirects your to ubers login
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

  //redirects you yelp page of associated venue
  $scope.moreDetails = function(){
    $window.location.href = $scope.data.url;
  };

  //redirects to google maps with that location preloaded
  $scope.googleRedirect = function(){
    $window.location.href = $scope.address.templateUrl;
  };

});



