const auth = require('../middleware/auth');
const {Movie, validateMovie} = require('../models/movie');
const {Genre} = require('../models/genre');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async function (req, res) {
    //Get the list of movies
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.get('/:id', async function (req, res) {
    //Find requested movie
    const movie = await Movie.findById(req.params.id);

    if(!movie){
        return res.status(404).send(`Could not find a movie with id=${req.params.id}`);
    }
    
    //Get the requested movie
    res.send(movie);
});

router.post('/', auth, async function (req, res) {
    //Validate requested  details
    const result = validateMovie(req.body);
    if(result.error){
        return res.status(400).send(result.error.message);
    }

    //Find the genre by id in the request
    const genre = await Genre.findById(req.body.genreId);

    if(!genre){
        return res.status(404).send(`Could not find a genre with id=${req.params.id}`);
    }

    //Create a new movie
    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    //Add to db
    try{
        await validateMovie(movie)
            .catch(err => {
                for(error in err.errors){
                    console.error(err.errors[error]);
                }
            });
        const result = await movie.save()
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.error('Inner catch:', err.message);
            });
    }catch(ex){
        console.error('Outer catch:', ex.message);
    }

    res.send(movie);
});

router.put('/:id', auth, async function (req, res) {
    //Validate requested details
    let result = validateMovie(req.body);
    if(result.error){
        return res.status(400).send(result.error.message);
    }

    //Find the genre by id in the request
    const genre = await Genre.findById(req.body.genreId);

    if(!genre){
        return res.status(404).send(`Could not find a genre with id=${req.params.id}`);
    }
    
    //Find and update requested movie
    const movie = await Movie.findOneAndUpdate(
        req.params.id,
        { title: req.body.title },
        { genre: {
            _id: genre._id,
            name: genre.name
        } },
        { numberInStock: req.body.numberInStock },
        { dailyRentalRate: req.body.dailyRentalRate });
    if(!movie){
        return res.status(404).send(`Could not find a movie with id=${req.params.id}`);
    }

    //Send the updated movie
    res.send(movie);
});

router.delete('/:id', auth, async function (req, res) {
    //Find and delete requested movie
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie){
        return res.status(404).send(`Could not find a movie with id=${req.params.id}`);
    }
    
    //Send the deleted movie
    res.send(movie);
});

module.exports = router;