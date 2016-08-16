var errorMessages = require(CONFIG.module_path + '/error').messages;
var _ = require('lodash');
var validator = require('validator');

var hexColor = /^#[0-9A-F]{6}$/i;
var name = /^[0-9A-Z \.]+$/i;

module.exports.checkQuery = function (schema) {
	return function (req, res, next) {
		req.checkQuery(schema);
		var errors = req.validationErrors(true);
		if (errors) {
			return next(errors);
		}

		req.query = setupForm(schema, req.query);
		return next();
	}
};

module.exports.checkBody = function (schema) {
	return function (req, res, next) {
		req.checkBody(schema);
		var errors = req.validationErrors(true);
		if (errors) {
			return next(errors);
		}

		req.body = setupForm(schema, req.body);
		return next();
	}
};

var allowedProperties = ['created_by_user_id', 'updated_by_user_id'];

function setupForm(schema, body) {
	var prop;
	var form = {};
	for (prop in schema) {
		var path = prop.split('.');
		var temp = form;
		var value = body;

		for (var i = 0; i < path.length; i++) {
			if (!temp.hasOwnProperty(path[i])) {
				temp[path[i]] = {};
			}
			if (i == path.length - 1) {
				temp[path[i]] = value[path[i]];
			} else {
				value = value[path[i]];
				temp = temp[path[i]];
			}
			if (!value) break;
		}
	}

	allowedProperties.forEach(function (p) {
		if (body.hasOwnProperty(p)) {
			form[p] = body[p];
		}
	});

	return form;
}

module.exports.options = {
	customValidators: {
		isHexColorStrict: function (value) {
			return hexColor.test(value);
		},
		isName: function (value) {
			return name.test(value);
		},
		has: function (value, options) {

			if (_.isArray(options)) {
				return options.indexOf(value) != -1;
			}

			for (var prop in options) {
				if (options[prop] == value) return true;
			}
			return false;
		},
		isArray: function (values, options) {
			if (_.isArray(values)) {
				if (options.notEmpty === true && values.length === 0) {
					return false;
				}

				if (!options.notEmpty && values.length === 0) {
					return true;
				}
				if (Object.keys(options).length == 0 || !(options.hasOwnProperty('validation') || options.hasOwnProperty('properties'))) {
					return true;
				}
				return values.every(function (val) {
					if (options.properties) {
						for (var prop in options.properties) {
							if (!val.hasOwnProperty(prop)) {
								if (options.properties[prop].optional) {
									continue;
								}
								return false;
							}
							if (options.properties[prop] !== true && !options.properties[prop].validation.call(validator, val[prop], options.properties[prop].options || [])) {
								return false;
							}
						}
					} else {
						if (!options.validation.call(validator, val, options.options || [])) {
							return false;
						}
					}
					return true;
				});
			}
			return false;
		},
		hasGroups: function (value, options) {
			var v = _.cloneDeep(value);

			var g, pattern, minMax, res;
			for (var i = 0; i < options.groups.length; i++) {
				g = options.groups[i];
				minMax = [];
				g.min && minMax.push(g.min);
				g.max && (g.max > (g.min || 0) || g.max == -1) && minMax.push(g.max == -1 ? '' : g.max);
				pattern = g.letter + (minMax.length > 0 ? '{' + minMax.join(',') + '}' : '');
				res = v.match(new RegExp(pattern, 'i'));
				if (res == null && !g.optional) {
					return false;
				}
				res && (v = v.replace(res[0], ''));
			}

			return v.length <= 0;
		}
	}
};

module.exports.checkListOptions = function (req, res, next) {
	req.checkQuery('search').optional();
	req.checkQuery('limit').optional().isInt({min: 1});
	req.checkQuery('page').optional().isInt({min: 1});
	!req.query.search && (req.query.search = false);
	req.query.limit && !req.query.page && (req.query.page = 1);
	req.query.limit && (req.query.limit = parseInt(req.query.limit));
	if (req.query.limit && req.query.page) {
		req.query.offset = (req.query.page - 1) * req.query.limit;
	}
	return next(req.validationErrors(true));
};

module.exports.checkId = function (paramName, zeroEnabled) {
	if (!Array.isArray(paramName)) {
		paramName = [paramName];
	}
	return function (req, res, next) {
		paramName.forEach(function (item) {
			req.checkParams(item, errorMessages.not_an_id).notEmpty().isInt({min: zeroEnabled === true ? 0 : 1});
		});
		return next(req.validationErrors(true));
	}
};

module.exports.setupForm = function (req, schema, next) {
	var errors = req.validationErrors(true);
	if (errors) {
		return next(errors);
	}

	req.body = setupForm(schema, req.body);
	return next();
};