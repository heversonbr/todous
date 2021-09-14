const mongoose = require('mongoose');

const todosSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: false
    }

});

module.exports = mongoose.model('Todos' , todosSchema);