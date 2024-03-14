const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb+srv://admin-2024:AryanGargVIT23@cluster0.vcusnju.mongodb.net/ClubConnect");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        trim: true
    },
    registrationNumber: {
        type: String,
        required: true,
        minLength: 9,
        maxLength: 9,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    registeredEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    registeredClubs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    }]
});

userSchema.methods.createHash = async function (plainTextPassword){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainTextPassword, salt);
}

userSchema.methods.validatePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
};


const clubSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    registrationNumber: {
        type: String,
        required: true,
        minLength: 9,
        maxLength: 9,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

clubSchema.methods.createHash = async function (plainTextPassword){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainTextPassword, salt);
}

clubSchema.methods.validatePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
};


const eventSchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
        minLength: 3
    },
});

const User = mongoose.model("User", userSchema);
const Club = mongoose.model("Club", clubSchema);
const Event = mongoose.model("Event", eventSchema);

module.exports = {
    User, Event, Club
}