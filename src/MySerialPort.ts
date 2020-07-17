import SerialPort, { parsers } from 'serialport';
import Readline from '@serialport/parser-readline';

export type TBaudRate =
  | 115200
  | 57600
  | 38400
  | 19200
  | 9600
  | 4800
  | 2400
  | 1800
  | 1200
  | 600
  | 300
  | 200
  | 150
  | 134
  | 110
  | 75
  | 50
  | number;

export type TSerialCallback = (data: string) => void;

export class MySerialPort {
  id!: number;
  portName!: string;
  baudRate!: TBaudRate;
  connection?: SerialPort;
  connected!: boolean;
  streamData!: string;
  private callback?: TSerialCallback;

  constructor(id: number, portName: string, baudRate: TBaudRate) {
    this.id = id;
    this.portName = portName;
    this.baudRate = baudRate;
    this.connected = false;
    this.streamData = '';
  }

  onConnect(callback?: TSerialCallback) {
    if (!!callback) {
      this.callback = callback;
    }
    console.log('onConnect', this.portName);
    this.connection = new SerialPort(this.portName, { baudRate: this.baudRate, autoOpen: false });

    this.connection.open((err) => {
      if (err) {
        return console.log('Error opening port: ', err.message);
      }
      this.connected = true;

      const lineStream = this.connection?.pipe(new Readline());

      lineStream.on('data', (data: any) => {
        console.log('>> ', data);
        this.streamData += data;
        !!this.callback && console.log('has callback');
        !this.callback && console.log('has not callback');
        !!this.callback && this.callback(data);
      });
    });
  }

  onDisconnect() {
    console.log('onDisconnect', this.id);
  }

  setCallback(callback: TSerialCallback) {
    this.callback = callback;
    console.log('callback set');
  }
}
