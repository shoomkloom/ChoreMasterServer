const mongoose = require('mongoose');
const Joi = require('joi');

const choreSchema = new mongoose.Schema({
    choreTemplateId: {
        type: String, 
        required: true
    },
    imageUrl: {
        type: String
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
        masterId: Joi.objectId().required(),
        choreTemplateId: Joi.objectId().required(),
        slaveId: Joi.objectId().required(),
        scheduledDates: Joi.object()
    }
    return Joi.validate(chore, choreSchema);
};

exports.Chore = Chore;
exports.validateChore = validateChore;