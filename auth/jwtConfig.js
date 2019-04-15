const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const secret = config.jwtSecret;
const User = require('../models/User');

// Routes to run auth on
const securedRoutes = [
    "/api/entities",
    "/api/events"
];

const verify = token => {
	jwt.verify(token, secret, (err, decoded) => {
		if(err) return false;
		return true;
	});
};

exports.authenticationHandler = (req, res, next) => {
	// Only run auth on secured routes
    const pathParts = req.path.split("/", 3);
    if (!securedRoutes.includes(`/${pathParts[1]}/${pathParts[2]}`)) return next();

    // check header
    const header = req.headers.authorization;
    if (header === undefined || header === "") return res.status(401).json({ error: "No Authorization Header" });

    // check token
    const token = (header as string).split(" ")[1];
    if (token === undefined || token === "") return res.status(401).json({ error: "No token provided" });

    const result = verify(token);
    if(!result){
    	return res.status(500).send({ error: 'Failed to authenticate token.' });
    }
    return res.status(200).send({ success: 'okay' });
}