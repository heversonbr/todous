//require('dotenv').config();
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');

// Routes 
const publicRouter = require('./api/routes/public');
const authRouter = require('./api/routes/auth');
const todosRouter = require('./api/routes/todos');
const todoTaskRouter = require('./api/routes/todo_task');

// Middleware for authentication
const {loadUserFromSession} = require('./api/middlewares/authController');

//debug only: 
// const debugRouter = require('./tests/debugRoutes');
// app.use('/debug/', debugRouter);
// debug middleware: used only to print request information
// const debugSessionMiddleware = require('./tests/debugSessionMiddleware')
//app.use(debugSessionMiddleware);

// loggers
const morgan = require('morgan'); 
app.use(morgan('dev'));
// logging package: https://www.npmjs.com/package/node-color-log
// levels : // success < debug < info < warn < error < disable 
const logger = require('node-color-log');
logger.setLevel(process.env.LOGGER_LEVEL); 

// body-parser : parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// body-parser : parse application/json
app.use(bodyParser.json());


// Connect to DB using mongoose
const dbOptions = {
    useNewUrlParser : true,
    useUnifiedTopology : true
}
// mongodb: 
// 1) use the hostname for native deployment of mongodb
// 2) use the service_name as defined in the docker_compose.yml for container deployment 
const mongodb_url='mongodb://' + process.env.MONGODB_HOSTNAME +':'+ process.env.MONGODB_HOST_PORT + '/' + process.env.MONGODB_NAME

logger.info('Trying to connect to ' + mongodb_url + ' ...')
const connectionPromise = mongoose.connect(mongodb_url, dbOptions)
.then(mongoose =>{ 
    mongoose.connection.getClient();
    logger.info("Connected to the database! Enjoy!")
})
.catch(err => {
    logger.error("Cannot connect to the database!");
    logger.error(err);
    process.exit();
});

// Session Store
const sessionStore =  MongoStore.create({
   //clientPromise: connectionPromise,   // Use either 'clientPromise and dbName', or 'mongoUrl and dbName'  
   mongoUrl: mongodb_url,
   dbName: process.env.MONGODB_NAME,
   collectionName: process.env.SESSION_DB_COLLECTION,  // DB collection (table) 
   autoRemove: 'interval',               
   autoRemoveInterval: 10 // In minutes. Default
   //autoRemove: 'native' // Default
})

// Configure session
app.use(session({
    secret: process.env.SESSION_SECRET,      // should be a large unguessable string                  
    saveUninitialized: false,     // don't create session until something stored
    resave: false,                // don't save session if unmodified
    name: process.env.SESSION_COOKIE_NAME, // The name of the session ID cookie to set in the response (and read from in the request). The default value is 'connect.sid'.
    store: sessionStore,
    cookie: {
        secure: true,           // Ensures the browser only sends the cookie over HTTPS.
        httpOnly: true,         // Ensures the cookie is sent only over HTTP(S), not client JavaScript, helping to protect against cross-site scripting attacks.
        //domain: 'example.com',  // indicates the domain of the cookie; use it to compare against the domain of the server in which the URL is being requested. If they match, then check the path attribute next.
        //path: 'foo/bar',        // indicates the path of the cookie; use it to compare against the request path. If this and domain match, then send the cookie in the request.
        //expires: 5 * 60 * 1000, // in miliseconds, Note If both expires and maxAge are set in the options, then the last one defined in the object is what is used.  The expires option should not be set directly; instead only use the maxAge option.  By default, no expiration is set, and most clients will consider this a "non-persistent cookie" and will delete it on a condition like exiting a web browser application.                                           },
        maxAge: 60 * 60 * 1000  // Specifies the number (in milliseconds) to use when calculating the Expires Set-Cookie attribute. This is done by taking the current server time and adding maxAge milliseconds to the value to calculate an Expires datetime. 
    },
    
 
}));

// CORS: enable CORS using npm package
var cors = require('cors');
app.use(cors());



// for each request, it verifies the session-data is in the request, if so it loads 
// the user obecjt related to the session
app.use(loadUserFromSession);  

// Routers that should handle requests
app.use('/', publicRouter);
app.use('/api/', [authRouter, todosRouter, todoTaskRouter]);



// Handling errors: must be at the bottom
// 404: The server can not find the requested resource. In the browser, 
// this means the URL is not recognized. In an API, this can also mean that
//  the endpoint is valid but the resource itself does not exist.
app.use( (req, res, next) => { 
    const error = new Error('404 - Resource Not Found');
    error.status = 404;
    next(error);
});

// 500: The server has encountered a situation it does not know how to handle.
app.use( (error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;