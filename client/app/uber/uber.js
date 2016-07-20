angular.module("sqrtl.uber", [])
  .controller("UberController", function($scope, Adventures){

    $scope.destination = { latitude: '0', longitude: '0'};
    $scope.current = { latitude: '0', longitude: '0'};


    $scope.geo = navigator.geolocation;

    $scope.geoFindMe = function(){
      $scope.geo.getCurrentPosition(function(success){
        $scope.current.latitude = success.coords.latitude;
        $scope.current.longitude = success.coords.longitude;
        $scope.destination.latitude = window.localStorage.getItem('latitude');
        $scope.destination.longitude = window.localStorage.getItem('longitude');
        console.log($scope.current);
        console.log($scope.destination);
      });

    };

   // $scope.getPrice()

    $scope.geoFindMe();
  });
