const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength:5,
        maxlength:50
    }
},{collection: 'genres'});

const Genre = mongoose.model('Genre', genreSchema, 'genres');

//Utilities
function validateGenre(genre){
    const genreSchema = {
        name: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(genre, genreSchema);
};

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genreSchema = genreSchema;