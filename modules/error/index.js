function APIError(message, status) {
	this.name = 'APIError';
	this.message = message || 'server_error';
	this.status = status || 500;
}
APIError.prototype = Object.create(Error.prototype);
APIError.prototype.constructor = APIError;
module.exports = APIError;
module.exports.messages = require("./messages");