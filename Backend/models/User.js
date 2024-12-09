const mongoose = require('mongoose');


const PersonSchema = new mongoose.Schema({
    serialNo: {
        type: Number,
        required: true,
        unique: true
    },

    fullName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true 
    },
    birthday: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    actions: {
        type: Array,
        default: []
    },
   
}, { timestamps: true });


const Person = mongoose.model('Person', PersonSchema);


module.exports = Person;