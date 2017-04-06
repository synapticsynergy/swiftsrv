angular.module('sqrtl.adventure', ["ngTouch"])

.controller('AdventureController', function($scope, $location, Adventures, $window, LocationFactory) {
  //variable assignments
  /**************************/

  //sets the scope data from local storage
  var dataShape = JSON.parse(window.localStorage.getItem('data'))[0];
  $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];
  var directionsService = new google.maps.DirectionsService();


  var findDistance = function(){
    var data = JSON.parse(window.localStorage.getItem('data'))[0];
    $scope.distance = Number((data.distance / 1609.34)).toFixed(1) + ' Miles';

  }


  //assigns the coordinates and google maps url
  $scope.refreshAddress = function(data) {
      $scope.address = {
        templateUrl: 'http://maps.google.com/maps?q=' + data.location.address1 + ' ' + data.location.address2 + ' ' + data.location.address3 + ',' + data.location.city
        };
  };

  findDistance();
  $scope.refreshAddress($scope.data);


  //$scope method assignments
  /**************************/

  //gets new data from localstorage when a new venue is requested
  $scope.getNew = function(){
    Adventures.dataShift();
    $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];
    findDistance();
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
  //assigns the coordinates and google maps url
    $scope.refreshAddress($scope.data);
    $window.location.href = $scope.address.templateUrl;
  };

});



