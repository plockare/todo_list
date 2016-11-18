module.exports.decorateResponse = function (res, data, options) {
	if (options.limit && options.page) {
		res.set({
			'x-count': data.count,
			'x-items-per-page': options.limit,
			'x-page': options.page
		});
	}
	return res;
};

module.exports.decorateResponseAndSend = function (res, options) {
	var _this = this;
	return function (result) {
		res = _this.decorateResponse(res, result, options);
		res.json(result.rows);
	}
};