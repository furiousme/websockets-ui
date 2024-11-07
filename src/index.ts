import { httpServer } from './http_server';
import { startWSserver } from './ws-server';
import process from 'node:process';

import 'dotenv/config';

const HTTP_PORT = process.env.HTTP_PORT || 8181;
const WS_PORT = process.env.WS_PORT || 3000;

httpServer.listen(HTTP_PORT);
startWSserver(WS_PORT);

console.log(
  `Static http server is running on the ${HTTP_PORT} port! Click to open: http://localhost:${HTTP_PORT}/`
);
console.log(`API server is running on the ${WS_PORT} port! ws://localhost:${WS_PORT}/`);
