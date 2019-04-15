/**
 * Checks if a param is present in a request
 */
isParamPresent = (param, req) => {
    const provided = req.body[param];
    return !(provided === "" || provided === undefined);
}

module.exports = {
	/**
	 * Checks if the required parameter is passed as part of the request
	 */
	requiredParams = params => {
		return (req, res, next) => {
			for(param in params){
				if(!isParamPresent(param, req)){
					return res.sendJsonError(`${param} not provided`);
				}
			}
			next();
		}
	},

	/**
	 * Checks if the passed parameters are present in the request
	 */
	requiredParam = (req, res, next) => {
		return (req, res, next) => {
			if(!isParamPresent(param, req)){
				return res.sendJsonError(`${param} not provided`);
			}
			next();
		}
	}
}