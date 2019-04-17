const express = require('express');
const bodyParser = require('body-parser');
const config = require("./config/config");
const mongoose = require('mongoose');
const { AuthenticationHandler } = require("./auth/jwtConfig");
const { CustomRouterFunctions } = require("./framework/CustomRouter");
const { Logger } = require('./framework/Logger');

const userRouter = require('./routes/user');
const profileRouter = require('./routes/profile');

// Initialize express and set port number
const app = express();
const port = process.env.PORT || config.port;

// Plug in body parser middleware for parsing json requests
app.use(bodyParser.json());

// Configuring mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoHost);

// When successfully connected
mongoose.connection.on('connected', () => {
  Logger.info('Connection to database established successfully');
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  Logger.error(`Error connecting to database: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  Logger.info('Database disconnected');
});

// Handle authentication
app.use(AuthenticationHandler);

// Handle custom router functions
app.use(CustomRouterFunctions);

// Handling GET for the root URL
app.get("/", (req, res) => {
    res.send("Welcome to the Twitter API <br> Visit /api for the API functionality.");
});

// Add routers
app.use("/api/user", userRouter);
app.use("/api/profile", profileRouter);

// Starting the API
app.listen(port, () => Logger.info(`Twitter API listening on port ${port}`));

module.exports = app;

