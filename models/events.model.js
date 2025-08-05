const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: [3 , 'Title length should be a minimum 3 character, got {VALUE}']
    },
    description: {
        type: String,        
    },
    status: {
        type: Boolean,
        default: true 
    },
    date: Date,
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }    
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;