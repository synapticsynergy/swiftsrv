angular.module("sqrtl.form", [])
  .controller("FormController", function($scope, Adventures){
    $scope.adventure = {};
    $scope.getLocationAndCategory = function(location, category){
      Adventures.requestAdventures(location, category)
        .then(function(data) {
          $scope.adventure = data;
        });
    };
  });