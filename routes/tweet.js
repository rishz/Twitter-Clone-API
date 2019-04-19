/**
 * Routes to create, read and delete Tweets
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Follows = require('../models/Follows');
const Tweet = require('../models/Tweet');
const { requiredParams, requiredParam } = require('../auth/paramHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');

/**
 * @api {post} /tweet Create a Tweet
 * @apiVersion 1.0.0
 * @apiName CreateTweet
 * @apiGroup Tweet
 * @apiDescription Lets a user create an tweet.
 *
 * @apiParam {String} body The tweet body
 *
 * @apiSuccess {String} status success
 */
 router.post("/", requiredParam("body"), async (req, res) => {
 	const tweet = new Tweet;
 	tweet.author = req.UserID;
 	tweet.body = req.body.body;
 	try {
        await tweet.save();
        res.json({ status: "success", _id: tweet._id });
    } catch (e) {
        res.sendJsonError("Event could not be saved");
    }
 });

/**
 * @api {get} /tweet/:id Retrieve a Tweet
 * @apiVersion 1.0.0
 * @apiName GetTweet
 * @apiGroup Tweet
 * @apiDescription Lets a user see their tweet.
 *
 * @apiSuccess {String} _id Tweet id
 * @apiSuccess {String} author Author id
 * @apiSuccess {String} body Tweet body
 * @apiSuccess {Date} date_created The date the tweet was created
 *
 * @apiError {string} TweetNotFound Tweet not found
 * @apiError {string} PrivacyError User cannot see this Tweet (not created by user)
 *
 */
 router.get("/:id", async (req, res) => {
 	
 	const tweet = await Tweet.findById(req.params.id);
 	// Tweet found?
 	if (null === tweet) return res.return404Error("tweet");

 	// Check privacy
 	if(tweet.author.toString() !== req.UserID) return res.sendJsonError("User cannot see this tweet (not created by user)");

 	res.json(tweet);
 });

/**
 * @api {delete} /tweet/:id Delete a Tweet
 * @apiVersion 1.0.0
 * @apiName DeleteTweet
 * @apiGroup Tweet
 * @apiDescription Lets a user delete their tweet.
 *
 * @apiSuccess {String} status success
 *
 * @apiError {string} TweetNotFound Tweet not found
 * @apiError {string} PrivacyError User cannot delete this Tweet (not created by user)
 */
  router.delete("/:id", async (req, res) => {
 	
 	const tweet = await Tweet.findById(req.params.id);
 	// Tweet found?
 	if (null === tweet) return res.return404Error("tweet");

 	// Check privacy
 	if(tweet.author.toString() !== req.UserID) return res.sendJsonError("User cannot delete this tweet (not created by user)");
 	
	try{
    	await tweet.remove();
    	res.sendStatusSuccess();
	} catch (err) { ErrorHandler(err, res); }
 });


module.exports = router;