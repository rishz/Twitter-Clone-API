/**
 * Routes implementing profile functionality
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Follows = require('../models/Follows');
const { requiredParams, requiredParam } = require('../auth/paramHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');

/**
 * @api {post} /profile/:id/follow Follow user
 * @apiVersion 1.0.0
 * @apiName FollowUser
 * @apiGroup Profile
 * @apiDescription Follows a user
 *
 * @apiSuccess {String} status success
 *
 * @apiError {string} UserNotFound User not found
 * @apiError {string} AlreadyFollows Already follows the user
 * @apiError {string} CannotFollowYourself User cannot follow themselves
 */
router.post("/:id/follow", async (req, res) => {
    const targetUser = await User.findById(req.params.id);

    // target user found?
    if (targetUser === null) return res.return404Error("user");

    // Trying to follow yourself?
    if (req.UserID === req.params.id) return res.sendJsonError("You cannot follow yourself");

    // Already follower?
    const follower = await Follows.findOne({$and: [
         { followeeID: req.UserID }, { followerID: req.params.id }
      ]});

    if(follower !== null) return res.sendJsonError("You are already a follower");

	// Add follower
	const follows = new Follows;
    follows.followeeID = req.UserID;
    follows.followerID = req.params.id;
    // Saving the follower
    try {
        await follows.save();
        res.sendStatusSuccess();
    } catch (err) { ErrorHandler(err, res); }
});

/**
 * @api {post} /profile/:id/unfollow Unfollow user
 * @apiVersion 1.0.0
 * @apiName UnfollowUser
 * @apiGroup Profile
 * @apiDescription Unfollows a user
 *
 * @apiSuccess {String} status success
 *
 * @apiError {string} UserNotFound User not found
 * @apiError {string} AlreadyUnfollows Already not following the user
 */
router.post("/:id/unfollow", async (req, res) => {
	const targetUser = await User.findById(req.params.id);

    // target user found?
    if (targetUser === null) return res.return404Error("user");

    // Already follower?
    const follower = await Follows.findOne({$and: [
         { followeeID: req.UserID }, { followerID: req.params.id }
      ]});
    if (follower === null) return res.sendJsonError("You are already not a follower");

	// Add follower
    follower.remove();
    res.sendStatusSuccess();
});

module.exports = router;