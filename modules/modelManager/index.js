"use strict";

var Promise = require('any-promise');
var path = require("path");
var mysql = require('mysql');
var Sequelize = require("sequelize");
var fs = require('fs');
var _ = require('lodash');
CONFIG.ENV.database.define = {freezeTableName: true, underscored: true, paranoid: true};
CONFIG.ENV.database.logging = CONFIG.ENV.DEBUG ? console.log : false;
var sequelize = new Sequelize(CONFIG.ENV.database.database, CONFIG.ENV.database.user, CONFIG.ENV.database.password, CONFIG.ENV.database);
var db = {};
var manager = {};

function getModel(name) {

	if (!db.hasOwnProperty(name)) {
		var p = path.join(CONFIG.resource_path, name, "model.js");
		if (!fs.existsSync(p)) {
			throw new Error('Path: "' + p + '" not exists');
		}
		db[name] = sequelize.import(p);
		if ("associate" in db[name]) {
			db[name].associate(manager);
		}
	}
	return db[name];
}

function getSearchQuery(searchAbles, searchString) {
	var arr = [];
	if (!searchString) {
		return null;
	}
	searchAbles.forEach(function (col) {
		if (typeof col == 'object') {
			arr.push(sequelize.where(col, {$like: '%' + searchString + '%'}));
		} else {
			var o = {};
			o[col] = {$like: '%' + searchString + '%'};
			arr.push(o);
		}
	});
	return arr;
}

function addLimit(query, options) {
	if (options.limit && options.offset) {
		return {
			query: query + ' LIMIT ?,?',
			params: [options.offset, options.limit]
		};
	} else if (options.limit) {
		return {
			query: query + ' LIMIT ?',
			params: [options.limit]
		};
	} else {
		return {
			query: query,
			params: []
		}
	}
}

manager.Sequelize = Sequelize;
manager.sequelize = sequelize;
manager.getModel = getModel;
manager.getSearchQuery = getSearchQuery;
manager.getTransaction = sequelize.transaction.bind(sequelize);
manager.addLimit = addLimit;

module.exports = manager;
