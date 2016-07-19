angular.module('sqrtl.adventure', [])

.controller('AdventureController', function($scope, Adventures) {
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




});



