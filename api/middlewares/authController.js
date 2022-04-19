const User = require('../models/User');

// logging package: https://www.npmjs.com/package/node-color-log
// levels : // success < debug < info < warn < error < disable 
const logger = require('node-color-log');
logger.setLevel(process.env.LOGGER_LEVEL); 


// This is a middleware use to facilitate the authentication process.
// here we will have 2 middleware functions. 
// the first will create a user object from a request if the session information is provided.
// the second  check if there is a user object at each request (this user object will exist 
//             only if the previous middleware has validate the session existence)

// The following middleware creates a user object, if session data is provided by the request 
module.exports.loadUserFromSession = function getUserFromSession(req, res, next) {

    logger.debug('---------------------------------------------------------');
    logger.debug('runnning loadUserFromSession');
    logger.debug('checking if session.id is associated to a user');
    logger.debug('---------------------------------------------------------');

    // Check if 'session information' was received in the request
    if(!(req.session && req.session.userId)){
        logger.debug('missing session/user information:  ');
        logger.debug('req.user: ' + req.user)
        return next();
    }

    // Check if session-id exists in the database
    logger.debug('finding user session: ' + req.session.userId);
    User.findById(req.session.userId, (err, user) => {
        // looks for a session 
        if (err) {
            logger.debug('error finding user session');
            return next(err);
        }
  
        if (!user) {
            logger.debug('no user session found');
            return next();
        }
        // If there is a session id for this user: 
        logger.debug('user session FOUND in DB for req.session.userId: ' + req.session.userId);
        // Remove the password hash from the User object. 
        // The password is brought by the query in the database. In this way we don't accidentally leak it.
        user.password = undefined;
        // logger.debug('user password set to null: ' + user.password);

        // Here is where we store the user object in the current request for developer usage. 
        // If the user wasn't found, these values will be set to a non-truthy value, so it won't affect anything.
        req.user = user;   // this variable is set and can used to validate the session. 
        logger.debug('req.user: ' + req.user);
        // res.locals.user = user;     
        // The res.locals property is an object that contains response local variables scoped to the request and because of this,
        // it is only available to the view(s) rendered during that request/response cycle (if any). 
        // Use this property to set variables accessible in templates rendered with res.render. The variables set on res.locals are available within a single request-response cycle, and will not be shared between requests.
        // This allow us to use our user variable in all the html templates.
        logger.debug('end loadUserFromSession');
        next();
    });
    
}

// This middleware checks if the user object exists (req.user), 
// if so the sessions was already validated. 
module.exports.loginRequired = function loginRequired (req, res, next){

    logger.debug('---------------------------------------------------------');
    logger.debug("-------- middleware authControlle/logingRequired --------");
    logger.debug('---------------------------------------------------------');
    logger.debug('req.user: ');
    logger.debug(req.user);
    logger.debug('---------------------------------------------------------');
    if (req.user) {
        logger.debug('user object exists: you are logged in')
        return next();
    }else{
        logger.debug('user object does not exist! you are not logged in');
        logger.debug("go to login page");
        // return res.redirect("/api/login");
        return res.status(400).json({status: 'FAIL' , message: 'Not logged in. Go to login page.'});  
    }
}

