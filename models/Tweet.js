const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * Model representation of the database stored Follows entity
 */
const tweetSchema = new Schema({
	author: {
 		type: Schema.Types.ObjectId,
 		ref: "User",
    	required: true
	},
	body: {
 		type: String,
    	required: true
	},
	date_created: { 
		type: Date,
		default: Date.now
	}
});

tweetSchema.index({ date_created: 1 });

module.exports =  mongoose.model('Tweet', tweetSchema);