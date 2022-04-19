require('dotenv').config();
const http = require('http');
const app = require('./app');

// logging package: https://www.npmjs.com/package/node-color-log
// levels : // success < debug < info < warn < error < disable 
const logger = require('node-color-log');
logger.setLevel(process.env.LOGGER_LEVEL); 

// REMIND: 
// - http.createserver() method: Returns a new instance of the http.Server class.
// Usage:
// const server = http.createServer( (req, res) => {
//     'callback function that handles every single request'
//   })
//  Ref: https://nodejs.dev/learn/the-nodejs-http-module
//
const server = http.createServer(app);

// REMIND: 
// - http.server.listen() method: Returns nothing but a callback function.
//              inbuilt application programming interface of class Server within the http module
//              which is used to start the server for accepting new connections.
// Usage:
// const server.listen(options[, callback])
//      option: It can be the port, host, path, backlog, exclusive, readableAll, writableAll, ipv6Only, etc depending upon user need.
//      callback: It is an optional parameter, it is the callback function that is passed as a parameter.
//

// Select the port to list based on the .env file content. Default port 5000
let APP_SERVER_PORT = 5000;
if(process.env.NODEJS_DOCKER_DEPLOYMENT=='true' || 'TRUE'){
    APP_SERVER_PORT=process.env.NODEJS_CONTAINER_PORT;
}else{
    APP_SERVER_PORT=process.env.NODEJS_HOST_PORT;
}

server.listen(APP_SERVER_PORT, () => {

    logger.info('Container Deployment : ' + process.env.NODEJS_DOCKER_DEPLOYMENT);
    logger.info('Logger Mode: ' + process.env.LOGGER_LEVEL);
    logger.info('APP Server Up! Listening at port:'  + APP_SERVER_PORT);
    
});
