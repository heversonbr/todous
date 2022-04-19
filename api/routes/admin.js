const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User');
const Todos = require('../models/Todo');
const TodoTask = require('../models/Task');
const {loginRequired}  = require('../middlewares/authController');

// logging package: https://www.npmjs.com/package/node-color-log
// levels : // success < debug < info < warn < error < disable 
const logger = require('node-color-log');
logger.setLevel(process.env.LOGGER_LEVEL); 

//const bcrypt = require('bcryptjs');
// const {loginValidation} = require('../validation/validation');
// const {registerValidation} = require('../validation/validation');

// GET: READ all todo lists
router.get('/todos/' ,loginRequired , (req, res, next) => { 
    
    logger.debug('/todos/ -> req.session.userId: ' + req.session.userId);
    logger.debug('/todos/ -> req.user._id: ' + req.user._id);
  
    Todos.find()
        .select('id title description owner') 
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                todolists: docs.map(docs => {
                    return{
                        id: docs._id,
                        title: docs.title, 
                        description: docs.description,
                        owner: docs.owner
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({ message: err});
        } );
});

module.exports = router;
