const express = require('express');
const router = express.Router();
const jwt = require('../auth/jwtConfig');
const User = require('../models/User');
const argon2 = require('argon2');
const { requiredParams, requiredParam } = require('../auth/paramHandler');

/**
 * Routes to register and login
 */

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

    const user = await User.findOne({email: email});

    // User found?
    if (null === user) return res.return404Error("user");

    // Check password
    if (!await argon2.verify(user.password, password)) return res.sendJsonError("You have entered a wrong password");

    // User authenticated, provided them with a bearer token
    const token = jwt.sign(user.id);

    await user.save();

    res.json(token);
});
