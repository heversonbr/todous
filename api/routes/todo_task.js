const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TodoTask = require('../models/Task');
const Todos = require('../models/Todo');

const {loginRequired}  = require('../middlewares/authController');
const Todo = require('../models/Todo');

// logging package: https://www.npmjs.com/package/node-color-log
// levels : // success < debug < info < warn < error < disable 
const logger = require('node-color-log');
logger.setLevel(process.env.LOGGER_LEVEL); 

// Routing refers to determining how an application responds to a client request to 
// a particular endpoint, which is a URI (or path) and a specific HTTP request method 
// (GET, POST, and so on). Each route can have one or more handler functions, which 
// are executed when the route is matched.
// I want something like this: 
// /api/todotasks/                     : all tasks of all todo lists
// /api/todotasks/:task_id             : a specific tasks element
// /api/todotasks/todos-list/:todos_id : all tasks from a specific todo-list
// Remind: each model is associated with one collection (table) in 
// the database. So, we will create 2 routes here one for each table.

// GET: READ all TASKS from all lists belonging to the logged user
router.get('/todotasks/', loginRequired , (req, res, next) => { 
    // NOTE:  user information comes from the session object, 
    //        loginRequired is used to ensure user validation
    logger.debug('-------------------------------------------------------------------------');
    logger.debug('/todotasks/ -> req.session.userId: ' + req.session.userId);
    logger.debug('/todotasks/ -> req.user._id: ' + req.user._id);
    logger.debug('-------------------------------------------------------------------------');


    TodoTask.find({ owner: req.session.userId })
        .populate('todoListId')
        //.populate('owner')
        .select('id task created dueDate status todoListId owner')   // we can use the select method to select specific fields and show only the ones we are interested in
        .exec()
        .then( docs => { 
            const response = {
                count: docs.length,
                tasks: docs.map(docs => {
                    return{
                        id: docs._id,
                        task: docs.task, 
                        status: docs.status,
                        date: docs.date,
                        duedate: docs.dueDate,
                        todoList: docs.todoListId,
                        owner: docs.owner
                    }
                })
            };
            return res.status(200).json({status: 'SUCCESS' , response: response}); 
        })
        .catch(err => {
            logger.error(err);
            return res.status(500).json({ status: 'FAIL' , message: err});
        } );
});

//GET: READ a specific TASK (given its id)
router.get('/todotasks/:task_id', loginRequired, async (req, res, next) => { 
    
    logger.debug('-------------------------------------------------------------------------');
    logger.debug('/todotasks/:task_id -> req.session.userId: ' + req.session.userId);
    logger.debug('/todotasks/:task_id -> req.user._id: ' + req.user._id);
    logger.debug('-------------------------------------------------------------------------');
    const receivedTaskId = req.params.task_id;

    // Check/validate if task is in some of the todo-lists belonging to the current user
    const todolists = await Todos.find({ owner: req.user._id });
    if(!todolists) return res.status(400).json({status: 'FAIL' , message: 'user has no todo-lists in DB'}); 
    logger.debug('todolists found in the database for current user');

    TodoTask.find({_id : receivedTaskId , todoListId : { $in : todolists } })
        .exec()
        .then( doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'No valid task id found'})
            }
        })
        .catch(err => { 
            logger.error(err)
            res.status(500).json({message: err});
        });
});

// POST: CREATE a new TASK into a specific list (must provide todo-list-id)
router.post('/todotasks/', loginRequired , async (req, res, next) => { 

    logger.debug('-------------------------------------------------------------------------');
    logger.debug('/todotasks/:task_id -> req.session.userId: ' + req.session.userId);
    logger.debug('/todotasks/:task_id -> req.user._id: ' + req.user._id);
    logger.debug('req.body:');
    logger.debug(req.body);
    logger.debug('-------------------------------------------------------------------------');
   
    // Check/validate if todo-list  exists and current user is the owner
    const todolist = await Todos.findOne({ _id: req.body.todoListId , owner: req.session.userId });
    if(!todolist) return res.status(400).json({status: 'FAIL' , message: 'todo-list not found in DB'}); 
    logger.debug('todolist found in the database');

    const todo_task = new TodoTask({
        _id: new mongoose.Types.ObjectId(),
        task: req.body.task,
        created: req.body.created ,
        dueDate: req.body.dueDate,
        status: req.body.status,
        todoListId: new mongoose.Types.ObjectId(req.body.todoListId),
        owner: new mongoose.Types.ObjectId(req.session.userId)
    });

    logger.debug('date? :' + req.body.dueDate instanceof Date);

    todo_task.save()
        .then( result => {
            logger.debug('Created todo-task');})
        .catch(err => { 
            logger.error(err);
            return res.status(500).json({ status: 'FAIL' , message: err});
        });
    // 201 Created
    return res.status(201).json({ status: 'SUCCESS' , response: todo_task });
});

// DELETE a specific task (given a task_id)
router.delete('/todotasks/:task_id', (req, res, next) => { 
    // logger.debug('delete method: ');
    const receivedTaskId = req.params.task_id;

    logger.debug('-------------------------------------------------------------------------');
    logger.debug('/todotasks/:task_id -> req.session.userId: ' + req.session.userId);
    logger.debug('/todotasks/:task_id -> req.user._id: ' + req.user._id);
    logger.debug('-------------------------------------------------------------------------');
   
    logger.debug(receivedTaskId);

    TodoTask.deleteOne({ _id: receivedTaskId })
    .exec()
    .then( result => {
        res.status(200).json(result);
    })
    .catch( err => { 
        logger.error(err)
        res.status(500).json({ message: err});
    });

    // only for initial test: 
    // res.status(200).json({
    //     message : 'Handling DELETE request for a specific todo-list (DELETE id)',
    //     todo_list_id : receveidId
    // });
});

// UPDATE a specific task (given a task_id)
router.patch('/todotasks/:task_id', (req, res, next) => { 

    logger.debug('-------------------------------------------------------------------------');
    logger.debug('/todotasks/:task_id -> req.session.userId: ' + req.session.userId);
    logger.debug('/todotasks/:task_id -> req.user._id: ' + req.user._id);
    logger.debug('-------------------------------------------------------------------------');
   
    const receivedTaskId = req.params.task_id;
    logger.debug(receivedTaskId);
   
    const updateOps = {};
    for (const ops of req.body){
        logger.debug(ops.propName);
        logger.debug(ops.value);
        updateOps[ops.propName] = ops.value;
    }
    logger.debug(updateOps);
    TodoTask.updateMany({ _id: receivedTaskId }, { $set: updateOps })
    .exec()
    .then( result => {
        logger.debug(result);
        res.status(200).json(result);
    })
    .catch( err => {
        logger.error(err);
        res.status(500).json({
            message: err,
        })
    });
    // only for initial test:
    // res.status(200).json({
    //     message : 'Handling PATCH request for a specific todo-list (UPDATE LIST)',
    //     id : receveidId
    // });
});

//GET: READ ALL TASKS of a specific todo-list (given the todo-id)
router.get('/todotasks/todos/:todo_id', (req, res, next) => { 
    
    const receivedTodosId = req.params.todo_id;

    logger.debug('-------------------------------------------------------------------------');
    logger.debug('/todotasks/:task_id -> req.session.userId: ' + req.session.userId);
    logger.debug('/todotasks/:task_id -> req.user._id: ' + req.user._id);
    logger.debug('receivedTodosId: ' + receivedTodosId);
    logger.debug('-------------------------------------------------------------------------');

    TodoTask.find({todoListId: receivedTodosId, owner: req.session.userId})
        .exec()
        .then( docs => {
            if (docs) {
                const response = {
                    count: docs.length,
                    todosListId: receivedTodosId,
                    tasks: docs.map(docs => {
                        return{
                            id: docs._id,
                            task: docs.task, 
                            status: docs.status,
                            date: docs.date,
                            duedate: docs.dueDate, 
                            todosListId: docs.todoListId                      
                        }
                    })
                };
                return res.status(200).json({ status: 'SUCCESS' , response: response });
            } else {
                //res.status(404).json({ message: 'No valid task id found'})
                return res.status(204).json({ status: 'FAIL' , message: 'No task found'});
            }
        })
        .catch(err => { 
            logger.error(err)
            return res.status(500).json({ status: 'FAIL' , message: err });
        });
});

module.exports = router;

