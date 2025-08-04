const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true        
    },
    email: {
        type: String,
        required: true,
        validate(val) {
            if(!validator.isEmail(val)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password length should be a minimum 6, got {VALUE}']
    },
    resetToken: {
        type: String        
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;