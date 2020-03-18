const auth = require('../middleware/auth');
const {Chore, validateChore} = require('../models/chore');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const log4js = require('log4js');
const logger = log4js.getLogger('chores');

router.get('/', auth, async function (req, res) {
    logger.debug('GET / - Invoked');
    //Get the list of chores
    const chores = await Chore.find().sort('name');
    res.send(chores);
});

router.get('/:id', auth, async function (req, res) {
    logger.debug(`GET /${req.params.id} - Invoked`);
    //Find requested chore
    const chore = await Chore.findById(req.params.id);

    if(!chore){
        logger.error(`Could not find a chore with id=${req.params.id}`);
        return res.status(404).send(`Could not find a chore with id=${req.params.id}`);
    }
    
    //Get the requested chore
    res.send(chore);
});

router.post('/', auth, async function (req, res) {
    logger.debug('POST / - Invoked');
    //Validate requested  details
    const result = validateChore(req.body);
    if(result.error){
        logger.error(`EXCEPTION - ${result.error}`);
        return res.status(400).send(result.error.message);
    }

    const masterUser = await User.findById(req.body.masterId);
    if(!masterUser){
        logger.error(`Could not find a user with id=${req.body.id}`);
        return res.status(404).send(`Could not find a user with id=${req.body.id}`);
    }

    //Create a new chore
    let chore = new Chore({
        choreTemplateId: req.body.choreTemplateId,
        masterId: req.body.masterId,
        slaveId: req.body.slaveId,
        scheduledDates: req.body.scheduledDates,
        comment: req.body.comment,
        state: 'enabled',
        createdDate: new Date()
    });

    chore = await chore.save();
    res.send(chore);
});

router.put('/:id', auth, async function (req, res) {
    logger.debug(`PUT /${req.params.id} - Invoked`);
    let chore = await Chore.findById(req.params.id);
    if(!chore){
        logger.error(`Could not find a chore with id=${req.params.id}`);
        return res.status(404).send(`Could not find a chore with id=${req.params.id}`);
    }

    //Update requested chore
    chore.choreTemplateId = req.body.choreTemplateId;
    chore.masterId = req.body.masterId;
    chore.slaveId = req.body.slaveId;
    chore.scheduledDates = req.body.scheduledDates;
    chore.comment = req.body.comment;
    chore.updatedDate = new Date();

    chore = await chore.save();

    //Send the updated chore
    res.send(chore);
});

router.delete('/:id', auth, async function (req, res) {
    logger.debug(`DEL /${req.params.id} - Invoked`);
    //Find and delete requested chore
    const chore = await Chore.findByIdAndRemove(req.params.id);
    if(!chore){
        logger.error(`Could not find a chore with id=${req.params.id}`);
        return res.status(404).send(`Could not find a chore with id=${req.params.id}`);
    }
    
    //Send the deleted chore
    res.send(chore);
});

module.exports = router;