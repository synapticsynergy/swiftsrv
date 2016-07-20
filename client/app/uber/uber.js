angular.module("sqrtl.uber", [])
  .controller("UberController", function($scope){
    $scope.destination = {};

    $scope.getDest = function(){
      $scope.destination = sessionStorage.getItem('latitude');
    }

    $scope.getDest();
  });
