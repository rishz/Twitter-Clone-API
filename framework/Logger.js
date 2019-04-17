const winston = require("winston");

const config = require("../config/config");

exports.Logger = new winston.Logger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `${config.environment}.log` }),
    ]
});
