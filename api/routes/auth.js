const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const {loginValidation} = require('../validation/validation');
const {registerValidation} = require('../validation/validation');
const {loginRequired}  = require('../middlewares/authController');
const path = require('path');

// logging package: https://www.npmjs.com/package/node-color-log
// levels : // success < debug < info < warn < error < disable 
const logger = require('node-color-log');
logger.setLevel(process.env.LOGGER_LEVEL); 

// GET login "/api/login" :
// Return: the login.html file containin a login form (email/password)
router.get( '/login' , (req, res, next) => {

    if (req.user) {
        logger.debug('user object exists: ' + req.user);
        logger.debug('You are logged in, redirect to dashboard.');
        return res.redirect("/api/dashboard");
    }

    logger.debug('Loads login page');
    //return res.status(200).json({status: 'SUCCESS' , message: 'Load/Render LOGIN page'}); 
    return res.status(200).sendFile(path.join(__dirname, '../../public/login.html'));
});

// GET login "/api/register" :
// Return: the register.html file containin the sign-up/register form (firstname, lastname, email, password)
router.get( '/register' , (req, res, next) => {
    logger.debug('Loads register page');
    //return res.status(200).json({status: 'SUCCESS' , message: 'Load/Render REGISTER page'}); 
    return res.status(200).sendFile(path.join(__dirname, '../../public/register.html'));
    
});

// POST login "/api/login" :
// Parameters: receive a json object that contains (email, password)
// Return: 1) a json objet { 
//                status : 'SUCCESS' , 
//                message : 'User ('+ user._id +') validated! ['+ user.firstName +'] Logged in!' 
//            },
//            if login is successful.
//         2)  a json object { status: 'error' , message: err.message} , if it fails.
router.post( '/login' , async (req, res, next) => {
    logger.debug('---------------------------------------------------------');
    logger.debug('running POST /login');
    logger.debug('---------------------------------------------------------');
    logger.debug('email: ' + req.body.email);
    logger.debug('password: ' + req.body.password);
    logger.debug('---------------------------------------------------------');

    // Validate the data (req.body) according to the validation schema. 
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).json({status: 'FAIL' , message: error.details[0].message});
    
    // Check if user exists.
    const user = await User.findOne({ email: req.body.email });
    logger.debug('user found in the database:')
    
    if(!user) return res.status(400).json({status: 'FAIL' , message: 'Email or password is wrong'}); 
    // the 'Email or password is wrong' is kind of vague MESSAGE, but it is better 
    // not revealing to much information to avoid attacks. 

    // Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    // Remove the password hash from the User object. 
    // The password is brought by the query in the database. In this way we don't accidentally leak it.
    user.password = undefined;
    if(!validPass) return res.status(400).json({status: 'FAIL' , message: 'Invalid password'});
    logger.debug('username/password validated')
    
    logger.debug('user._id: ' + user._id);
    // the login process creates a 'userId' property in the session object, if username/password are validated.
    // setting a property will automatically cause a Set-Cookie response to be sent
    // setting also makes the express-session module to store the data into the database.
    req.session.userId = user._id;
    
    logger.debug('setting req.session.userId: ' + req.session.userId);
    logger.debug('User validated! Logged in!');

    return res.status(200).send({ 
        status : 'SUCCESS' ,
        message : 'User ('+ user._id +') validated! ['+ user.firstName +'] Logged in!'
    });
    //logger.debug('redirecting to /api/dashboard!')
    //return res.redirect("/api/dashboard");
    //return res.status(200).sendFile(path.join(__dirname, '../../public/dashboard.html'));
});

// GET dashboardh "/api/dashboard" :
// Parameters: None
// Returns: a json object { status: 'SUCCESS' , message : 'Dashboard: ' + user.firstName + ' you are logged in'},  if it is logged in
//           a json object { status: 'FAIL' , message : err} if it is not logged in
router.get( '/dashboard' ,loginRequired , (req, res, next) => {

    logger.debug('---------------------------------------------------------');
    logger.debug('running GET /dashboard');
    logger.debug('---------------------------------------------------------');
    logger.debug('req.session.userId: ' + req.session.userId);
    logger.debug('---------------------------------------------------------');

    // Usually we do like this: we check if user exists before providing the resource.
    // User.findById(req.session.userId, (err, user) => {
    //     if(err){
    //         logger.debug("error finding user")
    //         //return next(err);
    //         return res.status(200).send({ status: 'FAIL' , message : err});
    //     }
    //     if(!user){
    //         logger.debug("user does not exist. redirecting to /login")
    //         //return res.status(200).send({ status: 'FAIL' , message : 'User does not exist. redirect to /login'});
    //         return res.redirect("/api/login");
    //     }
    //     // user found/
    //     logger.debug("user found, rendering dashboard");
    //     //res.render("dashboard");  // use this when using a template render module. e,g,. pug
    //     return res.status(200).send({ status: 'SUCCESS' , userID: user._id, message : 'Dashboard: ' + user.firstName + ' you are logged in'});
    //     //return res.status(200).sendFile(path.join(__dirname, '../../public/dashboard.html'));
    // });

    // BUT!!! now we use the 'loadUserFromSession' and 'loginRequired' functions to validate the user session. 
    //        As we validate the user with both functions we do not need to validate the user again here. 
    // NOTE that: if we dont use these generic validators we need to check the user here. 
    logger.debug("user found, rendering dashboard");
    return res.status(200).json({ status: 'SUCCESS' , userID: req.user._id, message : 'Dashboard: ' + req.user.firstName + ' you are logged in'});
    //res.render("dashboard");  // use this when using a template render module. e,g,. pug
    //return res.status(200).sendFile(path.join(__dirname, '../../public/dashboard.html'));


});

// POST register "/api/register" :
// Parameters: receive a json object that contains (firstname, lastname, email, password)
// Return: a json objet {{ status: 'SUCCESS' , message: 'created user: redirect to /' , user: savedUser._id}, if register is successful,  
//          a json object { status: 'error' , message: err.message}, if it fails.
router.post( '/register' , async (req, res, next) => {
    
    // debug only
    logger.debug('---------------------------------------------------------');
    logger.debug('running POST /register');
    logger.debug('---------------------------------------------------------');

    // Validate the data (req.body) according to the validation schema. 
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).json({status: 'FAIL' , message: error.details[0].message });

    // Check if user already exists.
    const mailExist = await User.findOne({ email: req.body.email });
    logger.debug('mailExist: ' +  mailExist);
    if(mailExist) return res.status(400).json({ status: 'FAIL' , message: 'Email already exists!'});
    

    // If user does not exist => Hash password before storing it
    // 14: Salt value => hash difficulty
    const hashedPassword = await bcrypt.hash(req.body.password, 14); 
    logger.debug('hashedPassword: ' +  hashedPassword);

    // Create new User object 
    const user = new User({ 
        _id: new mongoose.Types.ObjectId(),
        firstName : req.body.firstname ,
        lastName : req.body.lastname , 
        email : req.body.email , 
        password : hashedPassword
    }); 
    logger.debug('user: ' +  user);
    
    // Save into the database.
    try{
        const savedUser = await user.save();
        logger.debug('status: SUCCESS , message: created user: redirect to /  user: ' +  savedUser._id);
        return res.json({ status: 'SUCCESS' , message: 'created user: redirect to /' , user: savedUser._id});
         //return res.redirect("/");

    }
    catch(err){
        return res.json('status: FAIL , message: ' + err.message);
        res.status(400).json({ status: 'FAIL' , message: err.message});
    }  
});

// GET logout "/api/logout" : 
// Parameters: None
// Returns: a json object { status: 'SUCCESS' , message: 'Logged out! Redirect to /'}, if session destroy goes well. 
//          a json object { status: 'FAIL' , message: { 'Error login out. No-session found: ' : req.session } } , if it fails to find a session and delete it
router.get( '/logout' , (req, res, next) => {

    logger.debug('---------------------------------------------------------');
    logger.debug('running POST /logout');
    logger.debug('---------------------------------------------------------');
    logger.debug('req.session: ' + req.session);
    logger.debug('req.session.userId: ' + req.session.userId);
    logger.debug('---------------------------------------------------------');

    if(req.session) {
        logger.debug(req.session);
        req.session.destroy( (err) => {
            if(err){
                return res.status(200).json({ status: 'FAIL' , message: err })
            }
            logger.debug(req.session);
            return res.status(200).json({ status: 'SUCCESS' , message: 'Logged out! Redirect to /'})
            //return res.redirect("/");
        });       
    }else{
        return res.status(200).json({ status: 'SUCCESS' , message: { 'No-session found: you are Logged out' : req.session } })
    }
});


module.exports = router;