
(function(){
    
    'use strict'
    
    angular.module('draw')
    .directive('sideBar', function(){

        return {
            restrict: 'E',
            templateUrl: 'components/sidebar/sidebar.tpl.html',
            replace: 'true',
            controller: 'sidebarController'
        };

    });

})();
