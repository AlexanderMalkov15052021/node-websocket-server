const ws = require('ws');

const wsServer = new ws.Server({ port: 4000 });

function onConnect(wsClient) {
    console.log('New client');

    wsClient.send('Hellow!');

    wsClient.on('message', function (message) {
        try {

            const jsonMessage = JSON.parse(message);

            console.log(jsonMessage);

            switch (jsonMessage.action) {
                case 'ECHO':
                    wsClient.send(jsonMessage.data);
                    break;
                case 'PING':
                    setTimeout(function () {
                        wsClient.send('PONG');
                    }, 1000);
                    break;
                default:
                    console.log('Unknown command');
                    break;
            }
            
        } catch (error) {
            console.log('Error', error);
        }
    });

    wsClient.on('close', function () {

        console.log('Client disconnected');
    });
}

wsServer.on('connection', onConnect);