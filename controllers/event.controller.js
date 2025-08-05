const Event = require('../models/events.model.js');
const User = require('../models/users.model.js');
const EventInvite = require('../models/eventInvite.model.js');

const eventCreate = async (req, res) => {    
    try {
        const { title, description, date } = req.body;
        const event = await Event.create({ title, description, date, creator: req.user.id });
        res.status(201).json({event});
    } catch (error) {
        res.status(500).json({ message: `Something wrong while event create: ${error.message}` });
    }
}

const eventUpdate = async (req, res) => {
    try {        
        const event = await Event.findOne({ _id: req.params.id, creator: req.user.id });
        
        if(!event || event.id !== req.params.id)
            res.status(404).json({ message: 'Event not found.' });
        
        const { title, description, date } = req.body;
        const updatedEvent = await Event.updateOne({ _id: event.id }, { 
            $set: {
                title,
                description,
                date
            }
        });         
        res.status(200).json({updatedEvent});
    } catch (error) {
        res.status(404).json({ message: `Something wrong while event update: ${error.message}` });
    }
}

const allEvent = async (req, res) => {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const { page = 1, limit = 10, sort= 'createdAt', order = "DESC", search = '', startDate } = req.query;
    const offset = (page - 1) * limit;
    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

    // common filter
    const filter = {};
    if(search) {
        filter.title = { $regex: search, $options: 'i' };
    }
    if(startDate) {
        filter.date = { $gte: new Date(startDate) };
    }

    try {
        // get events created by user
        const createdQuery = Event.find({ ...filter, creator: userId })
            .populate('creator', 'name email')
            .sort(sortObj)
            .skip(offset)
            .limit(parseInt(limit));

        const createdCount = Event.countDocuments({ ...filter, creator: userId });

        // get event ids wehre user are invited
        const invitedEventIds = await EventInvite.find({ email: userEmail }).distinct('event');

        const invitedQuery = Event.find({ ...filter, _id: { $in: invitedEventIds } })
        .populate('creator', 'name email')
        .sort(sortObj)
        .skip(offset)
        .limit(parseInt(limit));

        const invitedCount = Event.find({ ...filter, _id: { $in: invitedEventIds } });

        // Run in parallel
        const [createdEvents, invitedEvents, totalCreated, totalInvited] = await Promise.all([
            createdQuery,
            invitedQuery,
            createdCount,
            invitedCount,
        ]);

        res.json({
            created: {
                total: totalCreated,
                data: createdEvents,
            },
            invited: {
                total: totalInvited,
                data: invitedEvents,
            },
            meta: {
                page: parseInt(page),
                limit: parseInt(limit),
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something wrong while getting all events.' });
    }

    /*     const events = await Event.find();
    if(!events) {
        res.status(404).json({ message: 'Events are not available.' });
    }
    res.json({events}); */
}

const getSingleEvent = async (req, res) => {
    try {
        const event = await Event.findById({_id: req.params.id});
       
        if(!event)
            res.status(404).json({ message: 'event not found' });

        res.json(event);        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
} 

const eventInvite = async (req, res) => {
    const eventId = req.params.id;
    const { emails } = req.body;
    
    const event = await Event.find({ _id: eventId, creator: req.user.id });

    if(!event)
        res.status(404).json({ message: 'Event not found.'});

    const invites = emails.map( email => ({ email, event: eventId }) );
    await EventInvite.insertMany(invites);
    res.json({ message: 'Users are invited for this event' });
}

module.exports = { eventCreate, eventUpdate, allEvent, getSingleEvent, eventInvite }