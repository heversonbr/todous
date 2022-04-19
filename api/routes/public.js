const express = require('express');
const router = express.Router();

// logging package: https://www.npmjs.com/package/node-color-log
// levels : // success < debug < info < warn < error < disable 
const logger = require('node-color-log');
logger.setLevel(process.env.LOGGER_LEVEL); 

const path = require('path');

// GET root "/" , home page :
// Return: an index.html which is the main entry to the app web-site.
//         or, a json object indicating the index page, with status: success 
router.get( '/' , (req, res, next) => {
    logger.debug('Loads index page');
    //return res.status(200).sendFile(path.join(__dirname, '../../public/index.html'));
    return res.status(200).send({status: 'SUCCESS' , message: 'Load INDEX page'}); 
});

module.exports = router;