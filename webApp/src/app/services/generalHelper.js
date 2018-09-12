/**
* @author ibtesam.latif
* created on 12.04.2017
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.services')
  .service('generalHelper', generalHelper);

  function generalHelper($http, $q, $uibModal, $filter, config, localStorage, toastr){

    var booleans_YesNo = [
      {value: false, text: 'No'},
      {value: true, text: 'Yes'},
    ];

    var toastOptions = {
      "autoDismiss": false,
      "positionClass": "toast-top-full-width",
      "type": "success",
      "timeOut": "5000",
      "extendedTimeOut": "2000",
      "allowHtml": false,
      "closeButton": false,
      "tapToDismiss": true,
      "progressBar": false,
      "newestOnTop": true,
      "maxOpened": "1",
      "preventDuplicates": true,
      "preventOpenDuplicates": true
    };

    var service = {
      getRoles: getRoles,
      roundDecimals: roundDecimals,
      initializeDatePickers: initializeDatePickers,
      launchModal: launchModal,
      showConfirmAlert: showConfirmAlert,
      showErrorAlert: showErrorAlert,
      showSuccessMessage: showSuccessMessage,
      showErrorMessage: showErrorMessage,
      showGeneralError: showGeneralError,
      getDeferResponse: getDeferResponse,
      getDeferError: getDeferError,
      getBooleanArray: getBooleanArray,
      showBoolean: showBoolean,
      getCurrentUser: getCurrentUser,
    };

    return service;

    function getRoles($scope, callback){
      $http.get(config.baseUrl+"/roles")
      .then(function(response){
        var response_data = response.data;
        if(response_data.code == 'OK'){
          $scope.roles = response_data.data;
          if(null != callback){
            callback();
          }
        }
      });
    }

    function roundDecimals(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    function initializeDatePickers() {
      $(document).ready(function(){
        $('.date').datetimepicker({
          format: 'YYYY-MM-DD'
        });
        $('.date').on('dp.change', function(){
          $(".date :input:text").trigger("change");
        });
      });
    }

    function launchModal(modal_options, callback){
      modal_options.animation = true;
      modal_options.size = 'lg';

      $uibModal.open(modal_options)
      .result.finally(function(){
        if(callback){
          callback();
        }
      });
    }

    function showConfirmAlert(message, callback){
      swal({
        title: message,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
      }, function(isConfirm){
        if(isConfirm) {
          callback();
        }
      });
    }

    function showSuccessAlert(message){
      swal({
        title: "Info!",
        text: message,
        type: "Info"
      });
    }

    function showErrorAlert(message){
      swal({
        title: "Alert!",
        text: message,
        type: "error"
      });
    }

    function showSuccessMessage(message){
      toastOptions.type = 'success';
      toastr.success(message, '', toastOptions);
    }

    function showErrorMessage(message){
      toastOptions.type = 'success';
      toastr.error(message, '', toastOptions);
    }

    function showGeneralError(){
      toastOptions.type = 'error';
      toastr.error("Something went wrong. Please try again", '', toastOptions);
    }

    function getDeferResponse(response, defer){
      if(response.data.code == 'CREATED' || response.data.code == 'OK'){
        return defer.resolve(response.data.data);
      }
      else{
        return defer.reject();
      }
    }

    function getDeferError(err, defer){
      return defer.reject(err);
    }

    function getBooleanArray(){
      return booleans_YesNo;
    }

    function showBoolean(data_arr, index, attrib) {
      var selected = [];
      selected = $filter('filter')(booleans_YesNo, { value: data_arr[index][attrib] });
      return selected.length ? selected[0].text : 'Not set';
    }

    function getCurrentUser(){
      return localStorage.getObject('dataUser');
    }
  }

})();
