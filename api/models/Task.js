const mongoose = require('mongoose');

// Everything in Mongoose starts with a Schema. 
// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const taskSchema = mongoose.Schema({

    _id: mongoose.Types.ObjectId,
    
    task: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    },
    dueDate: {
        type: Date,
        required: false
    }, 
    status: {
        type: String,
        default: 'open'
    },

    todoListId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Todos'
    },

    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
});
// NOTE: To use our schema definition, 
// we need to convert it into a Model we can work with.
// A Model is a class that's your primary tool for interacting with MongoDB. 
// An instance of a Model is called a Document.
module.exports = mongoose.model('TodoTask', taskSchema);