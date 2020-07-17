import express from 'express';
import http from 'http';
import path from 'path';
import WebSocket from 'ws';
import cors from 'cors';

import SerialPort from 'serialport';
import { PortManager } from './PortManager';

// ################### SERIAL ###################

PortManager.loadConfig();
SerialPort.list().then((list) => PortManager.setList(list));

PortManager.state$.ports.map((p) => {
  p.onConnect();
});

// ################### EXPRESS ###################

const app = express();
const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

// ################### WEBSOCKET ###################

interface IMessage {
  portName: string;
  content?: string;
}

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: any) => {
    const _message: IMessage = JSON.parse(message);
    console.log('<< WS received: %s', _message);
    ws.send(
      JSON.stringify({
        portName: _message.portName,
        content: `Connection to port ${_message.portName} request`,
      }),
    );

    const _port = PortManager.state$.ports.find((p) => p.portName === _message.portName);
    _port?.setCallback((data) => {
      console.log('callback', data);
      ws.send(JSON.stringify({ id: _port.id, portName: _port.portName, content: data }));
    });
  });

  console.log('<< WS client connected');
});

wss.on('close', () => {
  console.log('WS close');
});

wss.on('error', () => {
  console.log('WS error');
});

wss.on('listening', () => {
  console.log('WS listening');
});

server.listen(port, () => {
  console.log(`Server started on port ${port} :)`);
});
