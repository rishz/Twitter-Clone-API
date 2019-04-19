/**
 * Routes to register and login
 */
const express = require('express');
const router = express.Router();
const jwt = require('../auth/jwtConfig');
const User = require('../models/User');
const argon2 = require('argon2');
const { requiredParams, requiredParam } = require('../auth/paramHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');

/**
 * @api {post} /user/login Login
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup User
 * @apiDescription Returns a token with used for authentication and a useful payload with data.
 *
 * @apiParam {String} email The user's email address or username
 * @apiParam {String} password The user's password
 *
 * @apiSuccess {String} token A JWT format token
 *
 * @apiError {string} WrongPassword Incorrect password provided
 */
router.post("/login", requiredParams(["email", "password"]), async (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({email});

    // User found?
    if (null === user) return res.return404Error("user");

    // Check password
    if (!await argon2.verify(user.password, password)) return res.sendJsonError("You have entered a wrong password");

    // User authenticated, provided them with a bearer token
    const token = jwt.sign(user.id);

    res.json({token: token});
});

/**
 * @api {post} /user/register Register using email
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup User
 * @apiDescription Register a user using his email.
 *
 * @apiParam {String} email The user's email address
 * @apiParam {String} password The user's password
 *
 * @apiSuccess {String} token Token to be used to sign the user in
 */
router.post("/register", requiredParams(["email", "password"]), async (req, res) => {
    // hash password
    const hash = await argon2.hash(req.body.password);

    const email = req.body.email.toLowerCase();

    // Check email not in use
    const emailTaken = await User.findOne({ email });
    if (emailTaken !== null) return res.sendJsonError("Email already exists. Try Logging in");

    // Creating user object
    const user = new User;
    user.email = email;
    user.password = hash;

    // Saving the user
    try {
        await user.save();
        res.sendStatusSuccess();
    } catch (err) { ErrorHandler(err, res); }
});

module.exports = router;
