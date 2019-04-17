const { Logger } = require("../framework/Logger");
/**
 * Simple function used to catch and process errors in the request-response flow
 */
exports.ErrorHandler = (err, res) => {
    const errString = err.toString();
    Logger.error(errString);
    res.sendJsonError(errString);
}
