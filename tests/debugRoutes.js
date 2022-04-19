const express = require('express');
const router = express.Router();

// logging package: https://www.npmjs.com/package/node-color-log
// levels : // success < debug < info < warn < error < disable 
const logger = require('node-color-log');
logger.setLevel(process.env.LOGGER_LEVEL); 

router.get('/session', (req, res, next)=> {

    logger.debug('------------------------------------------------------------------------');
    logger.debug(req.session.id);
    logger.debug('------------------------------------------------------------------------');
    logger.debug(req.session);
    logger.debug('------------------------------------------------------------------------');
    logger.debug(req);
    logger.debug('------------------------------------------------------------------------');
    logger.debug(req.sessionID);
    logger.debug('------------------------------------------------------------------------');
    logger.debug('user: ' + user)
    logger.debug('------------------------------------------------------------------------');

    // setting a property will automatically cause a Set-Cookie response to be sent
    req.session.userId = '12345';
    
    return res.status(200).send({ status: 'ok', sessionId: req.session.id, session: req.session}); 
});

module.exports = router;