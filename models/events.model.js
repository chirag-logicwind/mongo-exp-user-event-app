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
    createdBy: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: ObjectId,
        ref: 'User'
    },
    invitedUsers: [{
        type: ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;