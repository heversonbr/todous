const express = require('express');

const app = express();
const todosRouter = require('./api/routes/todos');

// app.use( (req, res, next) => { 
//     res.status(200).json({
//         message : 'Hello! it works'
//     });

// });

app.use('/todos', todosRouter);


module.exports = app;