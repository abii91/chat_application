/**
 * *
 * Created on 05.01.2018.
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users')
      .controller('usersListCtrl', usersListCtrl);

  /** @ngInject */
  function usersListCtrl($scope, generalHelper, generalFactory, $filter, editableOptions, editableThemes,
    usersListService, ChatRoles
  ) {
    var vm = this;
    vm.smartTablePageSize = 10;
    vm.roles = [];
    vm.tab = $scope.tab;
    vm.booleans = [
      { value: false, text: 'No' },
      { value: true, text: 'Yes' },
    ];

    getRoles();

    function getRoles() {
      generalFactory
      .request('roles')
      .then(function(response_data){
        if(response_data.code == 'OK'){
          vm.roles = response_data.data;
        }
      });
    }

    vm.showBoolean = function(bool_value) {
      if(null != bool_value){
        var selected = [];
        selected = $filter('filter')(vm.booleans, {value: bool_value.toString()});
        return (null != selected) ? selected[0].text : 'Not set';
      }
    };

    vm.getRole = function(role) {
      var selected = [];
      selected = $filter('filter')(vm.roles, {id: role});
      return selected.length ? selected[0] : null;
    };

    vm.removeUser = function(index) {
      var url = "users/" + $scope.users[index].id;

      generalHelper.showConfirmAlert("Are you sure you want to delete this user?", function(){
        generalFactory
        .request(url, 'DELETE', null, "status")
        .then(function(response_status){
          if(response_status == 200){
            $scope.rowList.splice(index, 1);
          }
        });
      });
    };

    vm.addUser = function() {
      vm.inserted = {
        first_name: "",
        last_name: "",
        user_name: "",
        password: "",
        email: "",
        activated: true,
        role_id: {id: 1}
      };
      $scope.users.push(vm.inserted);
    };

    vm.saveUser = function(rowform, index) {
      usersListService.saveUser(rowform, index, $scope.users, function(response){
        var response_data = response.data.data;
        if(response.data.code == 'CREATED' || response.data.code == 'OK'){
          $scope.users[index] = response_data;
          if(response_data.id){
            $scope.users[index].id = response_data.id;
          }
          rowform.$submit();
          generalHelper
            .showSuccessMessage("New user has been saved successfully.");
        }
        else if(response.data.code == "E_UNIQUE_FIELD_VIOLATION"){
          var error_message = "The user with " + response.data.data.field_name +
            " (" + response.data.data.field_value + ") already exists.";

          generalHelper
            .showErrorMessage(error_message);
        }
      });
    };

    vm.cancelUser = function(rowform, index){
      if(null == $scope.users[index].id)
        $scope.users.splice(index, 1);

      rowform.$cancel();
    };

    $scope.$on('$destroy', function() {
        $("#chat_danger_alert").hide();
        $("#chat_success_alert").hide();
    });

    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';
  }

})();
