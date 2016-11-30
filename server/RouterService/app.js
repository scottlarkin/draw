 
(function(){
    
    'use strict'

    console.log('router service started');
    
    var amqp = require('amqplib/callback_api');
    var externalip = require('externalip');
    var port = 7000;
    var canvasCount = 0;
    const canvasLimit = 3;
    const limitReachedMessage = 'This app runs on a cheap (shit) Amazon VM with hardly any RAM or HDD space; due to these reasons there can only be ' + canvasLimit + ' networked canvases at any one time. This limit has been reached. Try again later.';
    var canvases = {};

    amqp.connect('amqp://localhost', (err, conn) => {
        conn.createChannel( (err, ch) => {

            externalip( (err, ip)  =>{
             
                var q = 'getAvailableCanvasService';

                ch.assertQueue(q, {durable: false});
                ch.prefetch(1);
                console.log(' [x] Awaiting RPC requests');
                
                ch.consume(q, function reply(msg) {

                    var r = 'localhost' + ':' + port;

                    console.log("checking  " +msg.content.toString() + "   " +  canvases[msg.content.toString()]);
                    if(canvases[msg.content.toString()] !== 1 && canvasCount === canvasLimit){
                        r = limitReachedMessage;
                    }

                    console.log(r);

                    ch.sendToQueue(msg.properties.replyTo, new Buffer(r.toString()), {correlationId: msg.properties.correlationId});

                    ch.ack(msg);
                });

            });

            ch.assertQueue('addCanvas', {durable: false});
            ch.prefetch(1);
            ch.consume('addCanvas', (msg) => {
                console.log('canvas created ' + msg.content.toString());
                canvases[msg.content.toString()] = 1;
                canvasCount++;
                ch.ack(msg);
            });

            ch.assertQueue('removeCanvas', {durable: false});
            ch.prefetch(1);
            ch.consume('removeCanvas', (msg) => {
                console.log('canvas removed');
                delete canvases[msg.content.toString()];
                canvasCount--;
                ch.ack(msg);
            });
        });
    });
    
})();
