const authenticate = require('../middlewares/auth.middleware.js');
const { eventCreate, eventUpdate } = require('../controllers/event.controller.js');
const { body } = require('express-validator');
const express = require('express');
const router = express.Router();

router.post('/create', authenticate, [
    body('title').notEmpty,
    body('description')
], eventCreate);

router.post('/update', authenticate, [
    body('title'),
], eventUpdate);

module.exports = router;