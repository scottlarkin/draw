
(function(){
    
    'use strict'
    
    angular.module('draw')
    .directive('footer', function(){

        return {
            restrict: 'E',
            templateUrl: 'components/footer/footer.tpl.html',
            replace: 'true',
            controller: 'footerController'
        };

    });

})();
