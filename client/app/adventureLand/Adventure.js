angular.module('sqrtl.adventure', ["ngTouch"])

.controller('AdventureController', function($scope, $location, Adventures, $window, LocationFactory) {
  //variable assignments
  /**************************/

  //sets the scope data from local storage
  var dataShape = JSON.parse(window.localStorage.getItem('data'))[0];
  console.log(dataShape);
  $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];
  var directionsService = new google.maps.DirectionsService();

  //since the method requesting distance from gmaps doesn't return anything,
  //we need to find the distance in the controller to avoid race conditions.
  var findDistance = function(){
    var data = JSON.parse(window.localStorage.getItem('data'))[0];
    var origin = window.localStorage.getItem('origin');
    var destination = data.location.address1 + ' ' + data.location.address2 + ' ' + data.location.address3 + ' ' + data.location.city || origin;

    var request = {
      origin      : origin, // a city, full address, landmark etc
      destination : destination,
      travelMode  : google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      $scope.$apply(function() {
        if ( status == google.maps.DirectionsStatus.OK ) {
          var distance = Math.ceil(response.routes[0].legs[0].distance.value / 1609.34) + ' Miles'; // the distance in metres
          if (distance) {
            window.localStorage.setItem('distance',distance);
            $scope.distance = window.localStorage.getItem('distance');
            console.log($scope.distance,'scope distance');
          } else {
            $scope.distance = undefined;
          }
        }
        else {
          // oops, there's no route between these two locations
          // every time this happens, a kitten dies
          // so please, ensure your address is formatted properly
        }
      });
    });
  }

  //gets distance to venue and formats it to kilometers,
  //it will not render to the page if the distance isnt availible

  findDistance();



  //assigns the coordinates and google maps url
  $scope.address = {
    templateUrl: 'http://maps.google.com/maps?q=' + $scope.data.location.address1 + ' ' + $scope.data.location.address2 + ' ' + $scope.data.location.address3 + ',' + $scope.data.location.city
  };

  //$scope method assignments
  /**************************/

  //gets new data from localstorage when a new venue is requested
  $scope.getNew = function(){
    Adventures.dataShift();
    $scope.data = JSON.parse(window.localStorage.getItem('data'))[0];
    $scope.distance = undefined;
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
    $scope.address = {
      templateUrl: 'http://maps.google.com/maps?q=' + $scope.data.location.address1 + ' ' + $scope.data.location.address2 + ' ' + $scope.data.location.address3 + ',' + $scope.data.location.city
    };
    $window.location.href = $scope.address.templateUrl;
  };

});



