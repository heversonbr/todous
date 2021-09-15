require('dotenv').config();
const express = require('express');
const morgan = require('morgan'); 
const bodyParser = require('body-parser');
const todosRouter = require('./api/routes/todos');
const todoTaskRouter = require('./api/routes/todos_task');
const mongoose = require('mongoose');
const app = express();


// Connect to DB 
// ex: mongoose.connect('mongodb://localhost:27017/mongoose_basics');
//1) 

mongoose.connect(process.env.DB_URL, 
    function (err) {
        
        if (err) {
            console.log('Error connecting to mongodb');
            throw err;
        };

        console.log('Connected to mongodb');
});
// 2)
// mongoose.connect(process.env.DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("Connected to the database!");
//   })
//   .catch(err => {
//     console.log("Cannot connect to the database!", err);
//     process.exit();
//   });
// 3) 
// try {
//     mongoose.connect(process.env.DB_URL);
//   } catch (error) {
//     console.log(error);
//   }

// // todos_item_obj :  [{ id: 1, description: '', status }]
// // todos_obj: [{ id: 1 , name: 'minha lista' , items: [ {todos_item_obj} ] }] 
const todos = [];

// morgan logging package
app.use(morgan('dev'))
// body-parser : parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// body-parser : parse application/json
app.use(bodyParser.json());

// to prevent CORS errors
app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin');
    res.header('Access-Control-Allow-Headers', 'Origen, X-Requested-With, Accept, Authorization ');
    if (req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", 'PUT, POST, PATCH, DEL, GET');
        return res.status(200).json({});
    }
    next();
}); 

// Routers that should handle requests
app.use('/api/', [todosRouter, todoTaskRouter]);


// Handling errors: 
app.use( (req, res, next) => { 
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use( (error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });

});


// app.use( (req, res, next) => { 
//     res.status(200).json({
//         message : 'Hello! it works'
//     });

// });


module.exports = app;