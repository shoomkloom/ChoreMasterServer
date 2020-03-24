const mongoose = require('mongoose');
const Joi = require('joi');

const choreSchema = new mongoose.Schema({
    choreTemplateId: {
        type: String, 
        required: true
    },
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength:4,
        maxlength:50
    },
    imageUrl: {
        type: String
    },
    details: { 
        type: String, 
        required: true,
        trim: true,
        minlength:5,
        maxlength:1024
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
            pastDates: [Date],
            everyDay: Boolean,
            everyWeek: Boolean,
            everyMonth: Boolean,
            everyYear: Boolean,
            repititions: Number
        }
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
        masterId: Joi.objectId().required(),
        choreTemplateId: Joi.objectId().required(),
        slaveId: Joi.objectId().required()
    }
    return Joi.validate(chore, choreSchema);
};

exports.Chore = Chore;
exports.validateChore = validateChore;