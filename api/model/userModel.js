const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, min: 4, unique: true},
    password: {type: String, required: true, min: 6}
})

const userModel = mongoose.model('userData', userSchema);

module.exports = userModel;