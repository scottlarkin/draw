(function(){

    'use strict'

    angular.module('draw')
    .service('socketInterfaceService', function(){

        var socket;

        var sis = {};

        sis.setPort = function(port){
            socket = io('http://localhost:' + port);
        }

        sis.registerResponse = function(message, response){
            socket.on(message, response);
        }

        sis.emitMessage = function(message, data){
            socket.emit(message, data);
        }

        function registerResponse(message, response){
            socket.on(message, response);
        }

        return sis;
    });


})();