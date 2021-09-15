const http = require('http');
// const app = require('./app_hello_world');
const app = require('./app');

const port = process.env.NODEJS_CONTAINER_PORT;
const server = http.createServer(app);
server.listen(port);

console.log('Server up! Listening at port ' + port);