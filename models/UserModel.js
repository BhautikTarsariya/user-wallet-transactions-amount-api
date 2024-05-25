const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    WalletBalance: {
        type: Number,
        default: 0
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);

const USER = mongoose.model('users', UserSchema);

module.exports = USER;
