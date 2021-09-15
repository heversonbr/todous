const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Todos = require('../models/todos');

// Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
// Each route can have one or more handler functions, which are executed when the route is matched.
// I want something like this: 
//  /api/todos                         : all todo-lists
//  /api/todos/:todos_id               : one specific todo-list

// Remind: each model is associated with one collection (table) in the database.
//         so, we will create 2 routes here one for each table.

router.get('/todos/', (req, res, next) => { 
// Remind: this is the get http that the api server will receive from the browser
  
        Todos.find()
            .select('id title description') 
            .exec()
            .then( docs => {
                // console.log(docs);
                const response = {
                    count: docs.length,
                    tasks: docs.map(docs => {
                        return{
                            id: docs._id,
                            title: docs.title, 
                            description: docs.description,
                        }
                    })
                };
                res.status(200).json(response);
                // if (docs.length >= 0){
                    //res.status(200).json(docs);
                // }else{
                //     res.status(200).json({ message: 'No entries found!'})
                // }
            })
            .catch(err => {
                res.status(500).json({ message: err});
            } );
});

// remind: this is the post http that the api server will receive from the browser
router.post('/todos/', (req, res, next) => { 
    // We get the post with the info that comes to the browser and we instantiate a new 
    // object Todos, declared/created under models. 
    const todos_list = new Todos({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description 
    });

    todos_list.save()
        .then( result => {
            console.log('Created todos-list');})
        .catch(err => { 
            console.log(err)
            res.status(500).json({ message: err});
        });

    res.status(201).json({
        message : 'performed POST request for todo list',
        todo_list : todos_list  
    });
});

router.get('/todos/:todos_id', (req, res, next) => { 
    // this get retrives all the task elements of a specific todos-list (id = todos_id)
    const receveidId = req.params.todos_id;

    Todos.findById(receveidId)
        .exec()
        .then( doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'No valid id found for the provided id'})
            }
        })
        .catch(err => { 
            console.log(err)
            res.status(500).json({ message: err});
        });
});

router.delete('/todos/:todos_id', (req, res, next) => { 
    // console.log('delete method: ');
    const receveidId = req.params.todos_id;
    console.log(receveidId);

    Todos.deleteOne({ _id: receveidId })
    .exec()
    .then( result => {
        res.status(200).json(result);
    })
    .catch( err => { 
        console.log(err)
        res.status(500).json({ message: err});
    });

    // just initial test: 
    // res.status(200).json({
    //     message : 'Handling DELETE request for a specific todo-list (DELETE id)',
    // });
});

router.patch('/todos/:todos_id', (req, res, next) => { 
    const receveidId = req.params.todos_id;
    console.log(receveidId);
       
    const updateOps = {};
    for (const ops of req.body){
        console.log(ops.propName);
        console.log(ops.value);
        updateOps[ops.propName] = ops.value;
    }
    // console.log(updateOps);
    Todos.updateMany({ _id: receveidId }, { $set: updateOps })
    .exec()
    .then( result => {
        // console.log(result);
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            message: err,
        })
    });
    // res.status(200).json({
    //     message : 'Handling PATCH request for a specific todo-list (UPDATE LIST)',
    //     id : receveidId
    // });
});




module.exports = router;

