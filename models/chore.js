const mongoose = require('mongoose');
const Joi = require('joi');

const choreSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength:5,
        maxlength:50
    },
    choreTemplateId: {
        type: String, 
        required: true
    },
    masterId: {
        type: String, 
        required: true
    },
    slaveId: {
        type: String, 
        required: true
    },
    state: {
        type: String, 
        required: true
    },
    scheduledDates: { 
        type: {
            nextDate: Date,
            lastDate: [Date],
            startDate: Date,
            everyDay: Boolean,
            everyMonth: Boolean,
            everyYear: Boolean,
            repititions: Number
        },
        required: true
    },
    comment: { 
        type: String, 
        trim: true,
        minlength:5,
        maxlength:1024
    },
    createdDate: {
        type: Date,
        required: true
    },
    updatedDate: {
        type: Date
    }
},{collection: 'chores'});

const Chore = mongoose.model('Chore', choreSchema, 'chores');

//Utilities
function validateChore(chore){
    const choreSchema = {
        name: Joi.string().min(5).max(50).required(),
        masterId: Joi.objectId().required()
    }
    return Joi.validate(chore, choreSchema);
};

exports.Chore = Chore;
exports.validateChore = validateChore;