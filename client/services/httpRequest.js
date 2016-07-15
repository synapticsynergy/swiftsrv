angular.model('sqrtl.httpRequest', [])
  .factory('Adventures', function($http){
    //requests venues that meet location and category criteria
    //TODO: add user parameters
    var requestAdventures = function(category, location){
      return $http({
        method: 'GET',
        url: '/api/getYelp',
        data: JSON.stringigfy({
          category: category,
          location: location
        })
      }).then(function(resp){
        return resp.data;
      });
    };

    return {
      requestAdventures: requestAdventures
    };

  })
  .factory('UserResponses', function($http){
    //tells the database if a user accepted suggestions
    var initialReaction = function(userName, restauranArray){
      return $http({
        method: 'POST',
        url: '/adventure',
        data: JSON
      })
    }

  })