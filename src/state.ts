import { MySerialPort } from './MySerialPort';

export interface IState {
  list?: any[];
  ports: MySerialPort[];
}

export const stateDefault: IState = {
  list: [],
  ports: [new MySerialPort(0, 'COM4', 115200), new MySerialPort(1, 'COM8', 115200)],
};
