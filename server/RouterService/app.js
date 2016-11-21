 
(function(){
    
    'use strict'
    
    var amqp = require('amqplib/callback_api');
    
    var port = 7000;
    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = 'queue';

            ch.assertQueue(q, {durable: false});
            ch.prefetch(1);
            console.log(' [x] Awaiting RPC requests');
            
            ch.consume(q, function reply(msg) {
                //var n = parseInt(msg.content.toString());

                var r = port;// fibonacci(n);

                ch.sendToQueue(msg.properties.replyTo,
                    new Buffer(r.toString()),
                    {correlationId: msg.properties.correlationId});

                ch.ack(msg);
            });
        });
    });
    
})();
