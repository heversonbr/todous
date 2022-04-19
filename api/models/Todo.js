const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: false
    },

    tasks: [{
        type: mongoose.Types.ObjectId,
        ref: 'TodoTask'
    }],

    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    //members: [{
    //    type: mongoose.Types.ObjectId,
    //    required: true,
    //    ref: 'User'
    //}]



    // TBD: members: array of schemas, type string,  IDs

});

module.exports = mongoose.model('Todos' , todoSchema);