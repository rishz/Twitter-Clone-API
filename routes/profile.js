/**
 * Routes implementing profile functionality
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
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
    const user = await User.findById(req.UserID);

    // target user found?
    if (targetUser === null) return res.return404Error("user");

    // Trying to follow yourself?
    if (req.UserID === req.params.id) return res.sendJsonError("You cannot follow yourself");

    // Already follower?
    const isAlreadyThere = targetUser.followers.some(followerID => followerID.equals(req.UserID));
    if(isAlreadyThere) return res.sendJsonError("You are already a follower");

	// Add follower
    targetUser.followers.push(req.UserID);
    await targetUser.save();

    // Reverse Add follower
    user.following.push(req.params.id);
    await user.save();

    res.sendStatusSuccess();
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
    const user = await User.findById(req.UserID);

    // target user found?
    if (targetUser === null) return res.return404Error("user");

    // Already follower?
    const isAlreadyThere = targetUser.followers.some(followerID => followerID.equals(req.UserID));
    if (!isAlreadyThere) return res.sendJsonError("You are already not a follower");

	// Add follower
    targetUser.followers.remove(req.UserID);
    await targetUser.save();

    // Reverse Add follower
    user.following.remove(req.params.id);
    await user.save();

    res.sendStatusSuccess();
});

module.exports = router;