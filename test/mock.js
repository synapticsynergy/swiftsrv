//Mock file to test for google maps API and geolocate
var google = {
    maps : {
        Marker : function () {
        },
        LatLng: function(lat, lng){
          return [lat, lng];
        },
        Map: function(obj){

        },
        Geocoder: function(arg){
          this.arg = arg;
        }
    }

};

var navigator = {
  geolocation : {
    getCurrentPosition: function(callback){

    }
  }
};