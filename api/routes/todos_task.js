const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TodoTask = require('../models/todos_task');

// Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
// Each route can have one or more handler functions, which are executed when the route is matched.
// I want something like this: 
//  /todos                         : all todo-lists
//  /todos/todos-id/               : one specific todo-list
//  /todos/todos-id/full           : all elements of a specific todo list 
//  /todos/todos-id/todo-item-id/  : a specific element of a specific todo list
// Remind: each model is associated with one collection (table) in the database.
//         so, we will create 2 routes here one for each table.

// read all tasks from all lists
router.get('/todotasks/', (req, res, next) => { 
    // inital test: 
    // res.status(200).json({
    //      message : 'performed GET request for a specific task'
    // });

    // read all tasks from all lists
    TodoTask.find()
        .select('id task created dueDate status todoListId ')   // we can use the select method to select specific fields and show only the ones we are interested in
        .exec()
        .then( docs => { 
            // the result of the find+select will the in 'docs' we can still manipulated 'docs'  for creating a more convinient result.   
            //console.log(docs);
            const response = {
                count: docs.length,
                tasks: docs.map(docs => {
                    return{
                        id: docs._id,
                        task: docs.task, 
                        status: docs.status,
                        date: docs.date,
                        duedate: docs.dueDate,
                        todoList: docs.todoListId
                         
                    }
                })
            };
            //if (docs.length >= 0){
                // res.status(200).json(docs);
                res.status(200).json(response);
            //}else{
                 //res.status(200).json({ message: 'No entries found!'})
            //}  
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err});
        } );
});

// create a task into a specific list (need to choose the list in advance)
router.post('/todotasks/', (req, res, next) => { 
    const todo_task = new TodoTask({
        _id: new mongoose.Types.ObjectId(),
        task: req.body.task,
        created: req.body.created ,
        dueDate: req.body.dueDate,
        status: req.body.status,
        todoListId: req.body.todoListId
    });

    todo_task.save()
        .then( result => {
            console.log(result);})
        .catch(err => { 
            console.log(err)
            res.status(500).json({ message: err});
        });

    res.status(201).json({
        message : 'performed POST request for a specific task',
        task : todo_task  
    });
});

//read a specific task 
router.get('/todotasks/:task_id', (req, res, next) => { 
    const receivedTaskId = req.params.task_id;

    TodoTask.findById(receivedTaskId)
        .exec()
        .then( doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'No valid task id found'})
            }
        })
        .catch(err => { 
            console.log(err)
            res.status(500).json({message: err});
        });
});


//read all tasks of a specific todo-list 
router.get('/todotasks/todos-list/:todos_id', (req, res, next) => { 
    const receivedTodosId = req.params.todos_id;

    TodoTask.find({todoListId: receivedTodosId})
        .exec()
        .then( docs => {
            if (docs) {
                //res.status(200).json(docs);
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
                res.status(200).json(response);

            } else {
                res.status(404).json({ message: 'No valid task id found'})
            }
        })
        .catch(err => { 
            console.log(err)
            res.status(500).json({message: err});
        });
});


// delete a specific task 
router.delete('/todotasks/:task_id', (req, res, next) => { 
    // console.log('delete method: ');
    const receivedTaskId = req.params.task_id;
    console.log(receivedTaskId);

    TodoTask.deleteOne({ _id: receivedTaskId })
    .exec()
    .then( result => {
        res.status(200).json(result);
    })
    .catch( err => { 
        console.log(err)
        res.status(500).json({ message: err});
    });

    // only for initial test: 
    // res.status(200).json({
    //     message : 'Handling DELETE request for a specific todo-list (DELETE id)',
    //     todo_list_id : receveidId
    // });
});

// update a specific task
router.patch('/todotasks/:task_id', (req, res, next) => { 
    const receivedTaskId = req.params.task_id;
    console.log(receivedTaskId);
   
    const updateOps = {};
    for (const ops of req.body){
        console.log(ops.propName);
        console.log(ops.value);
        updateOps[ops.propName] = ops.value;
    }
    console.log(updateOps);
    TodoTask.updateMany({ _id: receivedTaskId }, { $set: updateOps })
    .exec()
    .then( result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
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

module.exports = router;

