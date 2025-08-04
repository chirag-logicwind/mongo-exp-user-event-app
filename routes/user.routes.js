const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authenticate = require('../middlewares/auth.middleware.js');
const { register, login, logout, changePassword, resetPassword, updatePassword } = require('../controllers/user.controller.js');

router.post('/register', [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
], register);

router.post('/login', [    
    body('email').isEmail(),
    body('password').exists()
], login);

router.post('/logout', authenticate, logout);

router.post('/change-password', authenticate, [
  body('oldpassword').exists(),
  body('newpassword').isLength({ min: 6 })
], changePassword);

router.post('/reset-password', [
  body('email').isEmail(),
], resetPassword);

router.post('/update-password', authenticate, [
  body('newpassword')
], updatePassword);

module.exports = router;