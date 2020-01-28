const auth = require('../middleware/auth');
const {Group, validateGroup} = require('../models/group');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async function (req, res) {
    //Get the list of groups
    const groups = await Group.find().sort('name');
    res.send(groups);
});

router.get('/:id', async function (req, res) {
    //Find requested group
    const group = await Group.findById(req.params.id);

    if(!group){
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }
    
    //Get the requested group
    res.send(group);
});

router.post('/', auth, async function (req, res) {
    //Validate requested  details
    const result = validateGroup(req.body);
    if(result.error){
        return res.status(400).send(result.error.message);
    }

    const masterUser = await User.findById(req.body.masterId);
    if(!masterUser){
        return res.status(404).send(`Could not find a user with id=${req.body.id}`);
    }

    //Create a new group
    let group = new Group({
        name: req.body.name,
        masterUser: masterUser,
        createdDate: new Date()
    });

    console.log(group);

    group = await group.save();
});

router.put('/:id/addUser', auth, async function (req, res) {
    const group = await Group.findById(req.params.id);

    if(!group){
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }

    //Find the customer by id in the request
    const slaveUser = await User.findById(req.body.id);
    if(!slaveUser){
        return res.status(404).send(`Could not find a user with id=${req.body.id}`);
    }
    
    //Update requested group
    group.slaveUsers.push(slaveUser);
    group.updatedDate = new Date();
    group = await group.save();

    //Send the updated group
    res.send(group);
});

router.put('/:id/removeUser', auth, async function (req, res) {
    const group = await Group.findById(req.params.id);

    if(!group){
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }

    //Find the customer by id in the request
    const slaveUser = await User.findById(req.body.id);

    if(!masterUser){
        return res.status(404).send(`Could not find a user with id=${req.body.id}`);
    }
    
    //Update requested group
    const index = group.slaveUsers.indexOf(slaveUser);
    if (index > -1) {
        group.slaveUsers.splice(index, 1);
    }
    group.updatedDate = new Date();
    group = await group.save();

    //Send the updated group
    res.send(group);
});

router.delete('/:id', auth, async function (req, res) {
    //Find and delete requested group
    const group = await Group.findByIdAndRemove(req.params.id);
    if(!group){
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }
    
    //Send the deleted group
    res.send(group);
});

module.exports = router;