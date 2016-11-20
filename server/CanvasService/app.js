(function(){

    'use strict'

    var socket = require('./socket.js');
    var canvas = require('./canvas.js');

    var canvasClients = {};

    function createCanvas(canvasID){

        var c = new canvas.Canvas(canvasID, 1920, 1080 );
        c.clients = [];

        canvasClients[canvasID] = c;
    }

    createCanvas(0);

    socket.registerResponse('updateCanvas', (socket) => {

        return (data) => {

            data.canvas = canvasClients[data.canvas];

            socket.broadcast.emit('updatedPixels', canvas.updateCanvas(data));
        }
    });

    socket.registerResponse('joinCanvas', (socket) => {

        console.log('peanut');

        return (data) => {

            console.log('someone joined');

            canvasClients[data.canvas].clients.push(socket);
        }
    });

    socket.registerResponse('disconnect', (socket) => {

        return (data) => {
            var index = clients.indexOf(socket);
            if (index != -1) {
                console.log('someone left');
                clients.splice(index, 1);
                console.info('Client gone (id=' + socket.id + ').');
            }
        }
    });
 

})();

