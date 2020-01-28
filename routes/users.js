const auth = require('../middleware/auth');
const {User, validateFullUser: validateUser} = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

router.get('/me', auth, async function (req, res) {
    try{
        const user = await User.findById(req.user._id).select('-password');
        return res.send(user);
    }
    catch(ex){
        return res.status(500).send(ex);
    }
});

router.post('/', auth, async function (req, res) {
    //Validate requested  details
    const result = validateFullUser(req.body);
    if(result.error){
        return res.status(400).send(result.error.message);
    }

    let user = await User.findOne({ email: req.body.email });
    if(user){
        return res.status(400).send('User already registered');
    }

    //Create a new user and add to db
    user = new User(_.pick(req.body, ['name', 'email', 'password', 'phone']));
    user.createdDate = new Date();

    const salt = await bcrypt.genSalt(10);   
    user.password = await bcrypt.hash(user.password, salt) ;
    
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;