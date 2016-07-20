angular.module("sqrtl.form", [])
  .controller("FormController", function($scope, $state, Adventures){

    $scope.adventure = {};
    $scope.getLocationAndCategory = function(location, category){
      Adventures.requestAdventures(location, category)
        .then(function(data) {
          console.log(data);
          return true;
        })
        .then(function(){
          $scope.data = window.localStorage.getItem('data')[0];
          // $scope.data = Adventures.dataShift();
        })
        .then(function(){
          $state.go('adventure');
        });
    };
  });