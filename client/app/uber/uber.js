angular.module("sqrtl.uber", [])
  .controller("UberController", function($scope, Adventures){
    $scope.destination = { latitude: '0', longitude: '0'};

    $scope.getDest = function(){
      $scope.destination.latitude = sessionStorage.getItem('latitude');
      $scope.destination.longitude = sessionStorage.getItem('longitude');
    }

    $scope.getDest();
  });
