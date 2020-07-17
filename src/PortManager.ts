import fs from 'fs';
import path from 'path';

import { MySerialPort } from './MySerialPort';
import { IState, stateDefault } from './state';

const stateFile = path.join(__dirname, 'config.json');

let state$: IState = { ...stateDefault };

const loadConfig = () => {
  const fileData = fs.readFileSync(stateFile, { encoding: 'utf-8', flag: 'a+' });
  const _config: IState = JSON.parse(!!fileData ? fileData : JSON.stringify(stateDefault));
  _config.ports = _config.ports.map((it) => new MySerialPort(it.id, it.portName, it.baudRate));
  state$ = _config;
  saveConfig();
};

const saveConfig = () => {
  fs.writeFileSync(stateFile, JSON.stringify(state$));
};

const setPort = (port: MySerialPort): void => {
  console.log('setPort', port);
  state$ = { ports: state$.ports?.map((it) => (it.id === port.id ? port : it)) };
};

const setList = (list: any[]) => {
  state$ = { ...state$, list: [...list] };
  saveConfig();
};

const PortManager = { loadConfig, saveConfig, setPort, setList, state$ };

export { PortManager };
