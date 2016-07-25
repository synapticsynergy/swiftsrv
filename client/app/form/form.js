angular.module("sqrtl.form", ['uiGmapgoogle-maps','ngTouch'])
  .controller("FormController", function($scope, $state, Adventures, LocationFactory){

    $scope.geocoder = new google.maps.Geocoder();
    $scope.adventure = {};
    $scope.cll = undefined;
    $scope.cllYelp = undefined;
    $scope.calculating = false;
    $scope.location = undefined;

    $scope.getLocationAndCategory = function(location, category){
      Adventures.requestAdventures(location, category, $scope.cllYelp)
        .then(function(data) {
          console.log(data);
          return true;
        })
        .then(function(){
          $scope.data = window.localStorage.getItem('data')[0];

        })
        .then(function(){
          $state.go('adventure');
        });
    };

    $scope.findMe = function(){
      $scope.calculating = true;
      Adventures.geoFindMe(function(success){
        $scope.$apply(function(){
           $scope.cll = {latitude: success.coords.latitude, longitude: success.coords.longitude};
           $scope.cllYelp = success.coords.latitude + "," + success.coords.longitude;
           LocationFactory.setCoordinates($scope.cll);
           console.log("cll", $scope.cll);
           $scope.reverseGeocode();
           $scope.calculating = false;
        });
      });
    };

    $scope.reverseGeocode = function(){

      var latlng = new google.maps.LatLng($scope.cll.latitude, $scope.cll.longitude);
      $scope.geocoder.geocode({'latLng': latlng}, function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
          $scope.$apply(function(){
            console.log("geocode results ", results[0].formatted_address);
            $scope.location = results[0].formatted_address;
          });
        } else {
          console.log("Geocoder failed due to: " + status);
        }
      });
    };



  });