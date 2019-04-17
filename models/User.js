const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * Model representation of the database stored User entity
 */
const userSchema = new Schema({
 email: {
 	type: String,
    required: true
 },
 password: {
 	type: String,
 	required: true
 }
});

module.exports =  mongoose.model('User', userSchema);