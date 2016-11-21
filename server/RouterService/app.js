 
(function(){
    

    //this app will create and destroy canvas services as needed, and direct users to the service they need.
    //At the moment it just sends back "7000", which is the port number the canvas service uses
    //todo:
    //  When a client joins
    //      If they are connecting to a specific canvas 
    //          If the canvas already exists, send them to that canvas
    //      Else if the canvas doesnt exist, find a already existing service with space for another canvas, and send them to that
    //      If there is no canvas service with enough space for another canvas, create a new instance of the canvas service and send them to the new canvas service
    //
    //This app will need to keep a record of all active canvas services, with a list of canvases associated with each.
    //When a canvas is created this app will need to be notified
    //When a canvas is destroyed this app will need to be notified
    //
    //Max number of canvases/users per canvas service TBD (memory limited by number of canvases, CPU & bandwidth limited by number of users)
    //
    //Multiple instances of this service can run at the same time, rabbit will load balance requests between them

    'use strict'
    
    var amqp = require('amqplib/callback_api');
    
    var port = 7000;

    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = 'getAvailableCanvasService';

            ch.assertQueue(q, {durable: false});
            ch.prefetch(1);
            console.log(' [x] Awaiting RPC requests');
            
            ch.consume(q, function reply(msg) {

                var r = port;

                ch.sendToQueue(msg.properties.replyTo,
                    new Buffer(r.toString()),
                    {correlationId: msg.properties.correlationId});

                ch.ack(msg);
            });
        });
    });
    
})();
