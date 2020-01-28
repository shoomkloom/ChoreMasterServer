const mongoose = require('mongoose');
const Joi = require('joi');
const {userSchema} = require('./user');

const groupSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength:5,
        maxlength:50
    },
    masterUser: {
        type: userSchema,
        required: true
    },
    slaveUsers: [{
        type: userSchema
    }],
    createdDate: {
        type: Date
    },
    updatedDate: {
        type: Date
    }
},{collection: 'groups'});

const Group = mongoose.model('Group', groupSchema, 'groups');

//Utilities
function validateGroup(group){
    const groupSchema = {
        name: Joi.string().min(5).max(50).required(),
        masterId: Joi.objectId().required()
    }
    return Joi.validate(group, groupSchema);
};

exports.Group = Group;
exports.validateGroup = validateGroup;