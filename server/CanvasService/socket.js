(function(){

    'use strict'

    var canvas = require('./canvas.js');

    var io = require('socket.io').listen(7000);

    var num = 0;

    io.on('connection', function(socket){

        console.log( 'connected ' + ++num);

        socket.on('updateCanvas', onPixelUpdate(socket));

    });

    function onPixelUpdate(socket){
        return function(data){
            
            //notify all other connected users that the canvas has changed
            socket.broadcast.emit('updatedPixels', canvas.updateCanvas(data));
        }
    }
    
})();

