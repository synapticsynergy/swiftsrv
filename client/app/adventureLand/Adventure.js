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

  var getNew = function(){
    $scope.data = Adventures.dataShift();
  };

  $scope.getUber = function(location){
    console.log("location coords ", location);
    sessionStorage.setItem('latitude', location.latitude.toString());
    sessionStorage.setItem('longitude', location.longitude.toString());
    Adventures.getUber()
    .then(function(response){
      console.log("redirect URL ", response);
      $location.path(response);
    });
  };




});



