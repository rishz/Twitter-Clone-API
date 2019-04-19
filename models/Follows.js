const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * Model representation of the database stored Follows entity
 */
const followsSchema = new Schema({
	followeeID: {
 		type: Schema.Types.ObjectId,
 		ref: "User",
    	required: true
	},
	followerID: {
 		type: Schema.Types.ObjectId,
 		ref: "User",
    	required: true
	}
});

followsSchema.index({ followerID: 1 });

module.exports =  mongoose.model('Follows', followsSchema);