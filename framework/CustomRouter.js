/**
 * Creating our custom functions
 */
exports.CustomRouterFunctions = (req, res, next) => {
    /**
     * Return a success response
     */
    res.sendStatusSuccess = () => {
        return res.status(200).json({ status: "success" });
    };

    /**
     * Return an error
     */
    res.sendJsonError = (error) => {
        return res.status(400).json({ error });
    };

    /**
     * Return a response indicating that the entity requested could not be found
     */
    res.return404Error = (entity) => {
        return res.status(404).json({error: `Could not find ${entity}`});
    };

    next();
}
