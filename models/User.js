var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String
});
var UserModel = module.exports = mongoose.model('User', UserSchema);