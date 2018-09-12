
(function () {
'use strict';

  angular.module('BlurAdmin.pages.users')
    .service('usersListService', usersListService);

  function usersListService($q, $http, $filter, config, localStorage, generalHelper, generalFactory) {

    return {
      saveUser: saveUser,
    }

    function saveUser(rowform, index, scopeUsers, cbSuccess) {
      var user = rowform.$data;
      var api_method, api_url;

      if(!validateUser(user, index, scopeUsers))
        return;

      if(user.password == "")
        delete user["password"];

      if(scopeUsers[index].id){
        api_method = "PUT";
        api_url = "users/" + scopeUsers[index].id;
        user.id = scopeUsers[index].id;
      }
      else if(scopeUsers[index].customer_id){
        api_method = "PUT";
        api_url = "customers/" + scopeUsers[index].customer_id;
        user.id = scopeUsers[index].customer_id;
      }
      else {
        api_method = "POST";
        api_url = "users";
      }

      generalFactory.request(api_url, api_method, user, 'raw')
      .then(function(response){
        cbSuccess(response);
      });
    }

    function validateUser(user, index, scopeUsers){
      var invalid_fields = [];
      var is_valid = true;
      if(user.first_name == ""){
        invalid_fields.push("First name");
        is_valid = false;
      }
      if(user.last_name == ""){
        invalid_fields.push("Last name");
        is_valid = false;
      }
      if(user.user_name == ""){
        invalid_fields.push("Username");
        is_valid = false;
      }
      if(!(scopeUsers[index].id && scopeUsers[index].id > 0) && user.password == ""){
        invalid_fields.push("Password");
        is_valid = false;
      }
      if(!(user.email && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(user.email))){
        invalid_fields.push("Email");
        is_valid = false;
      }
      if(user.phone == ""){
        invalid_fields.push("Phone");
        is_valid = false;
      }
      if(user.location == ""){
        invalid_fields.push("Location");
        is_valid = false;
      }
      if(!is_valid){
        generalHelper.showErrorMessage("Please correctly fill the following fields: " + invalid_fields.join(', '));
      }
      return is_valid;
    }

  }
})();
