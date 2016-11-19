(function(){

    'use strict'

    angular.module('draw')
    .service('socketInterfaceService', function(){

        //todo - un hardcode this, use another app to tell the client which canvas app to connect to
        var socket = io('http://localhost:7000');

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

        return sis;
    });


})();