const ws = require('ws');  // wss://node-websocket-server-5ewl.onrender.com

const wsServer = new ws.Server({ port: 4000 });

const clients = [];

// Define the commands that can be sent to XILIN chargers in Modbus RTU format
const XILIN_CHARGER_REQ_CMD = {
    OPEN_OUTPUT: [0x01, 0x06, 0x00, 0x00, 0x00, 0x01, 0x48, 0x0A], // Command to open charger output
    CLOSE_OUTPUT: [0x01, 0x06, 0x00, 0x00, 0x00, 0x02, 0x08, 0x0B], // Command to close charger output
    // CHECK_VOLTAGE: [0x01, 0x03, 0x00, 0x0A, 0x00, 0x01, 0xA4, 0x08], // Command to check voltage (not used)
    CHECK_CURRENT: [0x01, 0x03, 0x00, 0x0B, 0x00, 0x01, 0xF5, 0xC8], // Command to check current
    CONNECTED_MSG: [0xEE, 0xFF, 0x00, 0xFF, 0xEE]// Command to establish connection (received)
};

function onConnect(wsClient) {
    console.log('New client');

    clients.push(wsClient);

    wsClient.send(`Hellow! Client ${clients.length}`);

    wsClient.on('message', function (message) {
        try {

            const jsonMessage = JSON.parse(message);

            switch (jsonMessage?.chargerAction) {
                case 'Start':

                    clients[0].send(Buffer.from(XILIN_CHARGER_REQ_CMD.OPEN_OUTPUT));

                    wsClient.send(`Clients num: ${clients.length}, Buffer: ${Buffer.from(XILIN_CHARGER_REQ_CMD.OPEN_OUTPUT)}, wsServer: ${wsServer}`);

                    break;
                case 'Stop':

                    clients[0].send(Buffer.from(XILIN_CHARGER_REQ_CMD.CLOSE_OUTPUT));

                    wsClient.send(`Clients num: ${clients.length}, Buffer: ${Buffer.from(XILIN_CHARGER_REQ_CMD.CLOSE_OUTPUT)}, wsServer: ${wsServer}`);

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