const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    firstName: { 
        type: String, 
        required: true 
    },

    lastName: { 
        type: String, 
        required: true 
    },

    email: { 
        type: String, 
        required: true , 
        unique: true
    },

    password: { 
        type: String, 
        required: true 
    },

    role: {  // defines the user role:  'user'=regular user, 'admin'= administrator
        type: String,
        required: true,  
        default: 'user',   //'user': regular user, 'admin': administrator
    }


});


module.exports = mongoose.model('User' , userSchema);