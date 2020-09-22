const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        pass: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: false
        },
        addressDetails: {
            type: String,
            required: false
        },
        firstName: {
            type: String,
            required: true
        },
        secondName: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: false
        },
        zip: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("User", schema);