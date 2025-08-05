const mongoose = require('mongoose');

const eventInviteSchema = new mongoose.Schema({
    email: {
        type: String,        
        require: true
    },
    event: {
        type: mongoose.Types.ObjectId,
        ref: 'Event',
        require: true
    }
}, { timestamps: true });

const EventInvite = mongoose.model('EventInvite', eventInviteSchema);

module.exports = EventInvite;