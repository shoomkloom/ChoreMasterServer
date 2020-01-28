const log4js = require('log4js');
const logger = log4js.getLogger('genres');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Genre, validateGenre} = require('../models/genre');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async function (req, res, next) {
    //Get the list of genres
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', validateObjectId, async function (req, res) {
    logger.log('GET /api/genres/:id Invoked.');
    //Find requested genre
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send(`Could not find a genre with id=${req.params.id}`);

    //Get the requested genre
    res.send(genre);
});

router.post('/', auth, async function (req, res) {
    logger.log('POST /api/genres/ Invoked.');
    //Validate requested details
    const result = validateGenre(req.body);
    if(result.error) return res.status(400).send(result.error.message);

    //Create a new genre
    let genre = new Genre({name: req.body.name});

    //Add to db
    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', auth, async function (req, res) {
    logger.log('PUT /api/genres/:id Invoked.');
    //Validate requested details
    let result = validateGenre(req.body);
    if(result.error){
        return res.status(400).send(result.error.message);
    }
    
    //Find and update requested genre
    const genre = await Genre.findOneAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true });
    if(!genre){
        return res.status(404).send(`Could not find a genre with id=${req.params.id}`);
    }

    //Send the updated genre
    res.send(genre);
});

router.delete('/:id', [auth, admin], async function (req, res) {
    //Find and delete requested genre
    console.log('Delete:', req.params.id);
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre){
        return res.status(404).send(`Could not find a genre with id=${req.params.id}`);
    }

    console.log('Deleted:', genre);
    
    //Send the deleted genre
    res.send(genre);
});

module.exports = router;