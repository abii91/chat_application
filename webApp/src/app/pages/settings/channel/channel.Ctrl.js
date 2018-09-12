/**
* Created by ibtesam.latif
* on 30.03.2018
*/
(function(){
  'use strict';

  var loyalty = angular.module('BlurAdmin.pages.settings');

  loyalty.controller("channelsCtrl", channelsCtrl);

  function channelsCtrl($scope, settingService, generalHelper, channelsService, $http, editableOptions, editableThemes, config) {
    var modal_options;
    $scope.smartTablePageSize = 10;
    $scope.channels = [];
    $scope.selectedChannel = null;
    $scope.type = "all";

    $scope.booleans = generalHelper.getBooleanArray();

    $scope.showActivate = function(index) {
      return generalHelper.showBoolean($scope.channels, index, "is_active")
    };

    channelsService.getChannels($scope);

    $scope.addChannel = function() {
      $scope.inserted = {
        name: "",
        group_id: null
      };
      $scope.channels.push($scope.inserted);
    };

    $scope.removeChannel = function(index) {
      generalHelper.showConfirmAlert("Are you sure you want to remove this channel?", function(){
        if($scope.channels[index].id) {
          $http({
            method: "DELETE",
            url: config.baseUrl+"/channels/"+$scope.channels[index].id
          })
          .then(function(response){
            if(response.data.code == 'OK'){
              $scope.channels.splice(index, 1);
              $scope.selectedChannel = null;
            }
          });
        }
      });
    };

    $scope.saveChannel = function(channel, index) {
      var api_method, api_url;

      if($scope.channels[index].id){
        api_method = "PUT";
        api_url = config.baseUrl+"/channels/"+$scope.channels[index].id;
        channel.id = $scope.channels[index].id;
      }
      else{
        api_method = "POST";
        api_url = config.baseUrl+"/channels";
        channel.group_id = null;
      }
      $http({
        method: api_method,
        url: api_url,
        data: channel
      })
      .then(function(response){
        var response_data = response.data;
        if(response_data.code == 'CREATED' || response_data.code == 'OK'){
          channelsService.getChannels($scope);
          if(response_data.code == 'CREATED'){
            generalHelper.showSuccessMessage("New channel has been added successfully.");
          }
          if(response_data.code == 'OK'){
            generalHelper.showSuccessMessage("Channel has been modified successfully.");

          }
        }
      });
    };


    $scope.selectChannel = function(channel) {
      $scope.selectedChannel = channel;
      getUCs();
    };

    function getUCs() {
      $http.get(config.baseUrl+"/channels/getChannelUsers?channel="+$scope.selectedChannel.id)
      .then(function(response){
        var response_data = response.data;
        if(response_data.code == 'OK'){
          $scope.UCList = response_data.data;
          $scope.UCs = [].concat($scope.UCList);
        }
      });
    };

    $scope.addUCs = function () {
      modal_options = {
        templateUrl: 'app/pages/settings/channel/addUser/addUser.html',
        controller: 'addUserCtrl',
        scope: $scope,
        resolve: {
          channel: function () {
            return $scope.selectedChannel;
          }
        }
      };
      generalHelper.launchModal(modal_options, getUCs);
    };

    $scope.removeUCs = function () {
      var user_ids = [];

      generalHelper.showConfirmAlert("Are you sure you want to remove these union councils?", function(){
        $scope.UCs.forEach(function(uc, index){
          if(uc.selected){
            user_ids.push(uc.id);
          }
        });
        $http({
          method: "POST",
          url: encodeURI(config.baseUrl+"/channels/removeChannelUsers"),
          data: {users: user_ids, channel: $scope.selectedChannel.id}
        })
        .then(function(response){
          var response_data = response.data;
          if(response_data.code == 'OK'){
            getUCs();
          }
        });
      });

    };

    $scope.$on('$destroy', function() {
      $("#obtech_danger_alert").hide();
      $("#obtech_success_alert").hide();
    });

    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

  }

})();
