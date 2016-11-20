(function(){

    'use strict'

    var amqp = require('amqplib/callback_api');
    const uuid = require('uuid');

    var connection;
    var channel;
    var queue;

    var pendingRequests = {};

    //connect to rabbitMQ
    amqp.connect('amqp://localhost', function(err, conn) {

        connection = conn;

        conn.createChannel(function(err, ch) {

            channel = ch;
            
            ch.assertQueue('', {exclusive: true}, function(err, q) {
                
                queue = q;
                channel.consume(queue.queue, function(msg) {
                    
                    let callback = pendingRequests[msg.properties.correlationId];

                    if(callback){
                        callback(msg.content.toString());
                        delete pendingRequests[msg.properties.correlationId];
                    }

                }, {noAck: true});

            });
        });
    });


    exports.sendMessage = function(q, message, callback){

        let msgId = uuid();

        pendingRequests[msgId] = callback;

        channel.sendToQueue(q, new Buffer(message), { correlationId: msgId, replyTo: queue.queue });
    }

})();