(function(){

    'use strict'

    var io = require('socket.io').listen(7000);

    var num = 0;

    var socket;
    var pendingResponses = [];

    io.on('connection', function(s){
        console.log('connected');
        socket = s;

        pendingResponses.forEach(r => exports.registerResponse(r.message, r.callback))

    });

    exports.registerResponse = (message, callback) => {
        
        if(!socket){
            pendingResponses.push({message: message, callback: callback});
            return;
        }

        console.log('activated ' + message);
        socket.on(message, callback(socket));
    }

})();

