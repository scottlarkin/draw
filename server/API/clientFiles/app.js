
(function(){
    
    'use strict'

    angular.module('draw', [])
    .controller('appController', function($http, socketInterfaceService, canvasService){

        $http({
                method: 'GET',
                url: '/getAvailableService'
            })
            .then(function(response) {
                socketInterfaceService.setPort(response.data);
                canvasService.init();
            });

    });

})();