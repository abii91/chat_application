/**
* @author ibtesam.latif
* created on 16.12.2015
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.services')
  .service('fileDownload', fileDownload);

  function fileDownload(){

    function download(data, headers, filename){
      var contentType = headers['content-type'];
      var linkElement = document.createElement('a');

      try {
        var blob = new Blob([data], { type: contentType });
        var url = window.URL.createObjectURL(blob);
        linkElement.setAttribute('href', url);
        linkElement.setAttribute("download", filename);
        var clickEvent = new MouseEvent("click", {
          "view": window,
          "bubbles": true,
          "cancelable": false
        });
        linkElement.dispatchEvent(clickEvent);
      } catch (ex) {
        console.log(ex);
      }
    }

    return {
      download: download
    };
  }

})();
