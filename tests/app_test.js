const express = require('express');
const app = express();
const logger = require('node-color-log');
const router = express.Router();



router.get('/', function (req, res) {
  logger.debug('Hello World!');
  return res.status(200).json('Hello World!');
});


app.use('/', router);

// app.listen(3000, function () {
//     console.log('Example app listening on port 3000!');
//   });

module.exports = app;