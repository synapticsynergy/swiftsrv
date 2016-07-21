angular.module("sqrtl.uber", ['ngLodash', 'uiGmapgoogle-maps'])
  .controller("UberController", function($scope, lodash, Adventures){

    var destination = { latitude: '0', longitude: '0'};
    var current = { latitude: '0', longitude: '0'};

    $scope.calculated = false;
    $scope.geo = navigator.geolocation;
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    $scope.geoFindMe = function(callback){
      $scope.geo.getCurrentPosition(function(success){
        callback(success);
      });
    };


   $scope.getPrice = function(){
    $scope.trip = { start_lat: $scope.current.latitude,
                 start_long: $scope.current.longitude,
                 final_lat: $scope.destination.latitude,
                 final_long: $scope.destination.longitude};

    Adventures.uberPrice($scope.trip)
    .then(function(result){
      console.log('price ', result);
      $scope.priceArray = result.prices;
    });

   };

   $scope.getRide = function(productId){
    $scope.trip.productId = productId;
    console.log('trip ', $scope.trip);

    Adventures.uberRide($scope.trip)
    .then(function(result){
      console.log('ride ', result);
    });

   };

  $scope.geoFindMe(function(success){
    $scope.$apply(function(){
      $scope.current = {latitude: success.coords.latitude, longitude: success.coords.longitude};
      $scope.destination = {latitude: window.localStorage.getItem('latitude'), longitude: window.localStorage.getItem('longitude')};
      console.log($scope.current);
      console.log($scope.destination);
      $scope.calculated = true;
    });
  });
});
