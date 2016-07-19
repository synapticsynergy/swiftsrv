angular.module('sqrtl.adventure', [])

.controller('AdventureController', function($scope, $location, Adventures) {
  // var businessName;
  // var distance;
  // var reviewCount;
  // var ratings;
  // var ratingsImage;
  // var businessImage;
  // var description;

  $scope.data = Adventures.dataShift();

  $scope.getNew = function(){
    $scope.data = Adventures.dataShift();
  };

  $scope.getUber = function(location){
    console.log("location coords ", location);
    Adventures.getUber()
    .then(function(response){
      console.log("redirect URL ", response);
      $location.path(response);
    });
  };
  $scope.address = {
    long: $scope.data.location.coordinate.longitude,
    lat: $scope.data.location.coordinate.latitude
  }
  //http://maps.google.com/maps?q=24.197611,120.780512





});



