import { httpServer } from "./src/http_server/index.js";
import { startWSserver } from "./src/ws-server/index.js";

import 'dotenv/config';

const HTTP_PORT = process.env.HTTP_PORT;
const WS_PORT = process.env.WS_PORT;

httpServer.listen(HTTP_PORT);
startWSserver(WS_PORT)

console.log(`Static http server is running on the ${HTTP_PORT} port!`);
console.log(`API server is running on the ${WS_PORT} port!`)
