const Event = require('../models/events.model.js');

const eventCreate = async (req, res) => {
    const { title, description } = req.body;

    try {
        const event = await Event.create({ title, description });
        res.status(201).json(event);
    } catch (error) {
        res.status(404).json({ message: `Something wrong while event create: ${error.message}` });
    }
}

const eventUpdate = async (req, res) => {
    try {
        const { title } = req.body;
        const event = await Event.findOne({ title });

        if(!event)
            res.status(404).json({ message: 'Event not found.' });
        
        const updatedEvent = await Event.updateOne({ _id: event.id }, { 
            $set: {
                title,
                description
            }
        });
         
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(404).json({ message: `Something wrong while event update: ${error.message}` });
    }
}


module.exports = { eventCreate, eventUpdate }