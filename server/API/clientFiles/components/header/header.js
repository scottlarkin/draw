
(function(){
    
    'use strict'
    
    angular.module('draw')
    .directive('header', function(){

        return {
            restrict: 'E',
            templateUrl: 'components/header/header.tpl.html',
            replace: 'true',
            controller: 'headerController'
        };

    });

})();
