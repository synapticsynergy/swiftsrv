angular.module("sqrtl.uber", ['ngLodash', 'uiGmapgoogle-maps'])
  .controller("UberController", function($scope, lodash, Adventures){

    $scope.destination = { latitude: '0', longitude: '0'};
    $scope.current = { latitude: '0', longitude: '0'};

    $scope.calculated = false;
    $scope.gotRide = false;
    $scope.gotPrices = false;
    $scope.geo = navigator.geolocation;
    $scope.map = {center: {latitude: 40.1451, longitude: -99.6680}, zoom: 14};


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
      $scope.gotPrices = true;
    });

   };

   $scope.getRide = function(productId, name){
    $scope.trip.productId = productId;
    $scope.trip.name = name;
    console.log('trip ', $scope.trip);

    Adventures.uberRide($scope.trip)
    .then(function(result){
      console.log('ride ', result);
      $scope.gotRide = true;
    });

   };

  $scope.geoFindMe(function(success){
    $scope.$apply(function(){
      $scope.current = {latitude: success.coords.latitude, longitude: success.coords.longitude};
      $scope.destination = {latitude: window.localStorage.getItem('latitude'), longitude: window.localStorage.getItem('longitude')};
      $scope.map.center.latitude = parseFloat($scope.current.latitude);
      $scope.map.center.longitude = parseFloat($scope.current.longitude);

      console.log($scope.current);
      console.log($scope.destination);
      console.log($scope.map.center);
      $scope.calculated = true;
    });
  });
});
