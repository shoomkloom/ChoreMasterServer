const auth = require('../middleware/auth');
const {Group, validateGroup} = require('../models/group');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const log4js = require('log4js');
const logger = log4js.getLogger('groups');

router.get('/', async function (req, res) {
    logger.debug('GET / - Invoked');
    //Get the list of groups
    const groups = await Group.find().sort('name');
    res.send(groups);
});

router.get('/:id', async function (req, res) {
    logger.debug(`GET /${req.params.id} - Invoked`);
    //Find requested group
    const group = await Group.findById(req.params.id);

    if(!group){
        logger.error(`Could not find a group with id=${req.params.id} - ` + ex);
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }
    
    //Get the requested group
    res.send(group);
});

router.post('/', auth, async function (req, res) {
    logger.debug('POST / - Invoked');
    
    //Validate requested details
    const result = validateGroup(req.body);
    if(result.error){
        logger.error(`ERROR - ${result.error.message}`);
        return res.status(400).send(result.error.message);
    }

    const masterUser = await User.findById(req.body.masterId);
    if(!masterUser){
        logger.error(`Could not find a user with id=${req.body.id}`);
        return res.status(404).send(`Could not find a user with id=${req.body.id}`);
    }

    //Create a new group
    let group = new Group({
        name: req.body.name,
        masterId: req.body.masterId,
        createdDate: new Date()
    });

    group = await group.save();

    //Send the created group
    res.send(group);
});

router.put('/:id/addUser/:userId', auth, async function (req, res) {
    logger.debug(`PUT /${req.params.id}/addUser/${req.params.userId} - Invoked`);
    let group = await Group.findById(req.params.id);

    if(!group){
        logger.error(`Could not find a group with id=${req.params.id}`);
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }

    //Find the customer by id in the request
    const slaveUser = await User.findById(req.params.userId);
    if(!slaveUser){
        logger.error(`Could not find a user with id=${req.params.userId}`);
        return res.status(404).send(`Could not find a user with id=${req.params.userId}`);
    }
    
    //Update requested group
    if(group.slaveIds.indexOf(req.params.userId) > -1){
        logger.info(`Group already has a user with id=${req.params.userId}`);
        return res.status(204).send(`Group already has a user with id=${req.params.userId}`);
    }
    else{
        group.slaveIds.push(req.params.userId);
        group.updatedDate = new Date();
        group = await group.save();
    }

    //Send the updated group
    res.send(group);
});

router.put('/:id/removeUser/:userId', auth, async function (req, res) {
    logger.debug(`PUT /${req.params.id}/removeUser/${req.params.userId} - Invoked`);
    let group = await Group.findById(req.params.id);

    if(!group){
        logger.error(`Could not find a group with id=${req.params.id}`);
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }

    //Find the customer by id in the request
    const slaveUser = await User.findById(req.params.userId);
    if(!slaveUser){
        logger.error(`Could not find a user with id=${req.params.userId}`);
        return res.status(404).send(`Could not find a user with id=${req.params.userId}`);
    }
    
    //Update requested group
    const index = group.slaveIds.indexOf(req.params.userId);
    if (index > -1) {
        group.slaveIds.splice(index, 1);
    }
    group.updatedDate = new Date();
    group = await group.save();

    //Send the updated group
    res.send(group);
});

router.put('/', auth, async function (req, res) {
    logger.debug(`PUT / - Invoked`);
    
    //Validate requested details
    const result = validateGroup(req.body);
    if(result.error){
        logger.error(`ERROR - ${result.error.message}`);
        return res.status(400).send(result.error.message);
    }

    const masterUser = await User.findById(req.body.masterId);
    if(!masterUser){
        logger.error(`Could not find a user with id=${req.body.id}`);
        return res.status(404).send(`Could not find a user with id=${req.body.id}`);
    }
    
    //Update requested group
    group.name = req.body.name;
    group.updatedDate = new Date();
    group = await group.save();

    //Send the updated group
    res.send(group);
});

router.delete('/:id', auth, async function (req, res) {
    logger.debug(`DEL /${req.params.id} - Invoked`);
    //Find and delete requested group
    const group = await Group.findByIdAndRemove(req.params.id);
    if(!group){
        logger.error(`Could not find a group with id=${req.params.id}`);
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }
    
    //Send the deleted group
    res.send(group);
});

module.exports = router;