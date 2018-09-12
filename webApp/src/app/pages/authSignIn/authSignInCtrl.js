(function() {
  'use strict';

  angular.module('BlurAdmin.pages.authSignIn')
  .controller('authSignInCtrl', authSignInCtrl);

  /** @ngInject */
  function authSignInCtrl($scope, localStorage, PermRoleStore, $state, $http) {
    var vm = this;

    vm.logar = logar;

    init();

    function init() {
      localStorage.clear();
      PermRoleStore.clearStore();
    }

    function logar() {
      var user_info = {
        user_name: vm.user,
        password : vm.passWord
      };
      $http.post("http://localhost:1337/signin", user_info)
      .then(function(response){
        var response_data = response.data;
        var current_user = response_data.data.user;
        if(response_data.code == 'OK'){
          localStorage.setObject('token', response_data.data.token);
          localStorage.setObject('dataUser', response_data.data.user);
          PermRoleStore.defineRole(current_user.role_id.role_name, []);

          if(PermRoleStore.getRoleDefinition('users')){
            $state.go('main.myGroups');
          }
          else{
            $state.go('main.chat');
          }
        }

      }, function(response) { // optional
        if(response.data.code == 'E_UNAUTHORIZED'){
          vm.signinError = "Please type username or password.";
        }
        else if(response.data.code == 'E_USER_NOT_FOUND' || response.data.code == 'E_WRONG_PASSWORD'){
          vm.signinError = "The username or password is incorrect.";
        }
      });
    }


  }

})();
