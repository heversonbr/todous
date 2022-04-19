const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Todos = require('../models/Todo');

const {loginRequired}  = require('../middlewares/authController');
// logging package: https://www.npmjs.com/package/node-color-log
// levels : // success < debug < info < warn < error < disable 
const logger = require('node-color-log');
logger.setLevel(process.env.LOGGER_LEVEL); 

// Routing refers to determining how an application responds to a client request 
// to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
// Each route can have one or more handler functions, which are executed when the route is matched.
// In this API we want to provide the following: 
//  /api/todos                    : read all todo-lists of a specific user
//  /api/todos/:todos_id          : read one specific todo-list of a specific user

// Remind: each model is associated with one collection (table) in the database.
//   

// GET: READ all todo lists of a specific (logged) user
router.get('/todos/' ,loginRequired , (req, res, next) => { 
    // NOTE:  user information comes from the session object, 
    //        loginRequired is used to ensure user validation
    logger.debug('---------------------------------------------------------');
    logger.debug('/todos/ -> req.session.userId: ' + req.session.userId);
    logger.debug('/todos/ -> req.user._id: ' + req.user._id);
    logger.debug('---------------------------------------------------------');
    Todos.find({ owner: req.user._id })
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
            //res.status(200).json(response);   
            return res.status(200).json({status: 'SUCCESS' , response: response});
        })
        .catch(err => {
            //res.status(500).json({ message: err});
            return res.status(500).json({status: 'FAIL' , message: err});
        } );

});

// POST: CREATE a new todo list 
router.post('/todos/' ,loginRequired , (req, res, next) => { 
    // We get the post with the info that comes to the browser and we instantiate a new object Todos, declared/created under models. 
    // NOTE: session is used to get the user_id and store user as todo-owner. loginRequired is used to ensure user is authenticaticated
    logger.debug('---------------------------------------------------------');
    logger.debug('/todos/ -> req.session.userId: ' + req.session.userId);
    logger.debug('/todos/ -> req.user._id: ' + req.user._id);
    logger.debug('---------------------------------------------------------');
    const todos_list = new Todos({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        owner: new mongoose.Types.ObjectId(req.user._id)
    });

    todos_list.save()
        .then( result => {
            logger.debug('Created todos-list');})
        .catch(err => { 
            logger.error(err);
            return res.status(500).json({ status: 'FAIL' , message: err});
        });

    return res.status(200).json({status: 'SUCCESS' , response: todos_list});

});

// GET: READ a specific todo list (given its id)
router.get('/todos/:todo_id', loginRequired, (req, res, next) => { 
    // this get retrives all the task elements of a specific todos-list (id = todos_id)
    const receveidId = req.params.todo_id;

    logger.debug('---------------------------------------------------------');
    logger.debug('READ /todos/:todo_id -> req.session.userId: ' + req.session.userId);
    logger.debug('READ /todos/:todo_id -> req.user._id: ' + req.user._id);
    logger.debug('receveidId: ' + receveidId);
    logger.debug('---------------------------------------------------------');

    //Todos.findById(receveidId)
    Todos.find({ _id: receveidId , owner: req.user._id })
        .exec()
        .then( doc => {
            logger.debug(doc)
            if (doc) {
                return res.status(200).json({ status: 'SUCCESS' , response: doc });
            } else {
                return res.status(204).json({ status: 'FAIL' , message: 'Not found'})
            }
        })
        .catch(err => { 
            logger.error(err);
            return res.status(500).json({ status: 'FAIL' , message: err });
        });
});

// DELETE a specific todo list (given its id)
router.delete('/todos/:todo_id', loginRequired, (req, res, next) => { 
 
    const receveidId = req.params.todo_id;
    logger.debug('---------------------------------------------------------');
    logger.debug('DELETE /todos/:todo_id -> req.session.userId: ' + req.session.userId);
    logger.debug('DELETE /todos/:todo_id -> req.user._id: ' + req.user._id);
    logger.debug('receveidId: ' + receveidId);
    logger.debug('---------------------------------------------------------');

    Todos.deleteOne({ _id: receveidId , owner: req.user._id })
    .exec()
    .then( result => {
        res.status(200).json({ status: 'SUCCESS' , response: result });
    })
    .catch( err => { 
        logger.error(err);
        res.status(500).json({ status: 'FAIL' , message: err});
    });

});

// UPDATE a specific todo list (given its id)
router.patch('/todos/:todo_id', loginRequired, (req, res, next) => { 
    
    const receveidId = req.params.todo_id;
    logger.debug('-------------------------------------------------------------------------');
    logger.debug('DELETE /todos/:todo_id -> req.session.userId: ' + req.session.userId);
    logger.debug('DELETE /todos/:todo_id -> req.user._id: ' + req.user._id);
    logger.debug('receveidId: ' + receveidId);
    logger.debug('req.body: ');
    logger.debug(req.body);
    logger.debug('-------------------------------------------------------------------------');

    const updateOps = {};
    for (const ops of req.body){
        logger.debug('ops.propName: ' + ops.propName);
        logger.debug('ops.value: ' + ops.value);
        updateOps[ops.propName] = ops.value;
    }
    // logger.debug(updateOps);
    Todos.updateMany({ _id: receveidId , owner: req.user._id}, { $set: updateOps })
    .exec()
    .then( result => {
        logger.debug(result);
        return res.status(200).json({ status: 'SUCCESS' , response: result });
    })
    .catch( err => {
        logger.error(err);
        return res.status(500).json({ status: 'FAIL' , message: err, })
    });

});

module.exports = router;

