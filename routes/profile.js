/**
 * Routes to user's profile
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requiredParams, requiredParam } = require('../auth/paramHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');

router.post("/test", requiredParams(["testparam"]), (req, res) => {
    res.json({success: 'ok'});
});

module.exports = router;