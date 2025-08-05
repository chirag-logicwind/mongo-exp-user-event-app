const authenticate = require('../middlewares/auth.middleware.js');
const { eventCreate, eventUpdate, allEvent, getSingleEvent, eventInvite } = require('../controllers/event.controller.js');
const { body } = require('express-validator');
const express = require('express');
const { events } = require('../models/events.model.js');
const router = express.Router();

router.post('/create', authenticate, [
    body('title').notEmpty(),    
    body('date').isISO8601()
], eventCreate);

router.put('/:id/update', authenticate, [
    body('date').isISO8601()
], eventUpdate);

router.post('/:id/invite', authenticate, [
    body('emails').isArray({ min: 1 })
], eventInvite);

router.get('/:id', authenticate, getSingleEvent);

router.get('/', authenticate, allEvent);

module.exports = router;