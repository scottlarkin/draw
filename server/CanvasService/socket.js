(function(){

    'use strict'

    var canvas = require('./canvas.js');

    var io = require('socket.io').listen(7000);

    var num = 0;

    io.on('connection', function(socket){

        console.log( 'connected ' + ++num);

        socket.on('updatePixels', onPixelUpdate(socket));

    });

    function onPixelUpdate(socket){
        return function(data){
            let canvasId = data.canvas;
            let pixels = data.pixels;

            //notify all other connected users that the canvas has changed
            socket.broadcast.emit('updatedPixels', pixels);

            //update the internal state of the canvas
            pixels.forEach( pixel => {
                canvas.setPixel(canvasId, pixel[0], pixel[1], pixel[2]);
            });
        }
    }
    
})();

