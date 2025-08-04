const mongoose = require('mongoose');
const User = require('../models/users.model.js');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken.js');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const email_exists = await User.findOne({ email: email });    

    if(email_exists)
        return res.status(400).json({ message: 'email already registed.' })

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });    
    res.status(201).json(user);    
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isPassMatch = await bcrypt.compare(password, user.password);
    // console.log(user);
    if(!user || !isPassMatch) {
        res.status(404).json({ message: 'Invalid Credentials.' });        
    }      
    res.json({ token: generateToken(user) });
}

const logout = (req, res) => {
    res.json({ message: 'Logout Success!' });
}

const changePassword = async (req, res) => {
    const user = await User.findById(req.user.id);    
    const { oldpassword, newpassword } = req.body;

    if(!await(bcrypt.compare(oldpassword, user.password)))
        res.status(404).json({ message: "Invalid old password." });

    user.password = await bcrypt.hash(newpassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password changed successfully!' });
}

const resetPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if(!user)
        res.status(404).json({ message: 'Email is not registered..! ' });

    const token = generateToken(user);
    user.resetToken = token;
    await user.save();
    
    res.status(200).json({ message: 'Password reset link generated', token: token });
}

const updatePassword = async (req, res) => {
    const { newpassword } = req.body;
    const token = req.headers['authorization'].split(' ')[1];    

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        console.log('reset pass update ', user);

        if(!user || user.resetToken !== token)
            res.status(404).json({ message: 'Token Invalid' });

        user.password = await bcrypt.hash(newpassword, 10);
        user.resetToken = null;
        await user.save();
        
        res.json({ message: 'Password reset successfully.' });
    } catch (error) {
        res.status(400).json({ message: `Invalid token : ${error.message}` });
    }
}

module.exports = { register, login, logout, changePassword, resetPassword, updatePassword };