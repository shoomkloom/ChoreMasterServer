const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre');

const movieSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true,
        minlength:5,
        maxlength:50
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
},{collection: 'movies'});

const Movie = mongoose.model('Movie', movieSchema, 'movies');

//Utilities
function validateMovie(movie){
    const movieSchema = {
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(5).max(255),
        dailyRentalRate: Joi.number().min(5).max(255)
    }
    return Joi.validate(movie, movieSchema);
};

exports.Movie = Movie;
exports.validateMovie = validateMovie;
exports.movieSchema = movieSchema;