
(function(){
    
    'use strict'

    angular.module('draw', [])
    .controller('appController', function(canvasService){
       
       canvasService.init();
       
    });

})();