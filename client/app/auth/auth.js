// {"web":{"client_id":"675533001795-ogilvisa2ekn4ehkgvuh3qd19oovr2q3.apps.googleusercontent.com","project_id":"sqrtl-1377","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"d5RHTO-rBKek0MYrYayjGuxu"}}


angular.module("sqrtl.auth", [])
  .controller("AuthController", function($scope, Adventures, $window){
    $scope.login = function (){
      console.log("called in auth");
      Adventures.authGoogle()
        .then(function(response){
          console.log("redirect URL ", response);
          $window.location.href = response;
        });
    };
  });



