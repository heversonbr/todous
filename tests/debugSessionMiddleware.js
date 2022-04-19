// logging package: https://www.npmjs.com/package/node-color-log
// levels : // success < debug < info < warn < error < disable 
const logger = require('node-color-log');
logger.setLevel(process.env.LOGGER_LEVEL); 

const debugSessionMiddleware = function getUserFromSession(req, res, next) {

    logger.debug('------------------------------------------------------------');
    logger.debug('---------- DEBUG SESSION MIDDLEWARE (Request) --------------')
    logger.debug('------------------------------------------------------------');
    logger.debug('---------------------- url ---------------------------------');
    logger.debug('URL: ' + req.url);
    logger.debug('Method: ' + req.method);
    logger.debug('------------------------------------------------------------');
    logger.debug('--------------------- headers ------------------------------');
    logger.debug(req.headers);
    logger.debug('------------------------------------------------------------');
    logger.debug('--------------------- session ------------------------------');
    logger.debug('req.session.id: ' + req.session.id);
    logger.debug('req.session => ');
    logger.debug(req.session);
    logger.debug('req.session.userId: ' + req.session.userId);
    logger.debug(req.session.cookie);
    logger.debug('------------------------------------------------------------');
    logger.debug('req.user: ');
    logger.debug(req.user);
    logger.debug('------------------------------------------------------------');
    logger.debug('--------------  END DEBUG SESSION MIDDLEWARE   -------------');
    next();


}

module.exports = debugSessionMiddleware;
