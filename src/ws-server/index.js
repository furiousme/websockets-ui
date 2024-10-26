import { WebSocketServer } from 'ws';

export const startWSserver = (port) => {
    const wss = new WebSocketServer({ port });
    wss.on('connection', (ws) => {
        console.log('New client connected!');
        ws.on('message', (data) => {
            console.log(data);
            wss.clients.forEach((client) => {
                client.send(data.toString());
            });
        });

        ws.on('error', console.error);

        ws.on('open', function open() {
          ws.send('something');
        });
    });
}
