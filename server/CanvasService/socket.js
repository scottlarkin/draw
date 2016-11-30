(function(){

    'use strict'

    var io = require('socket.io').listen(7000);

    var messageResponses = [];

    io.on('connection', (s) =>{
        console.log('connected');

        messageResponses.forEach(r => s.on(r.message, r.callback(s)));
    });

    exports.registerResponse = (message, callback) => {  
        messageResponses.push({message: message, callback: callback});
    }

})();

