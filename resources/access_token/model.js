var uuid = require('node-uuid');
var moment = require('moment');
var modelManager = require(CONFIG.module_path + '/modelManager');
var AuthModel = function (sequelize, DataTypes) {
	var Auth = sequelize.define(CONFIG.db.tables.access_token, {
			id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
			user_id: {type: DataTypes.INTEGER},
			access_token: DataTypes.STRING,
			expiration: DataTypes.DATE
		},
		{
			paranoid: false,
			timestamps: false,
			indexes: [
				{
					unique: true,
					fields: ['access_token']
				},
			],
			classMethods: {
				associate: function (manager) {
					Auth.belongsTo(manager.getModel(CONFIG.db.tables.user), {foreignKey: 'user_id'});
				},
				createAccessToken: function (user) {
					var uid = uuid.v4();
					return Auth.create({
						user_id: user.user_id,
						access_token: uid,
						expiration: moment().add(CONFIG.ENV.session.expiration_in_seconds, 'seconds')
					});
				},
				getToken: function (token) {
					return Auth
						.find({
							attributes: ['id', 'user_id', 'access_token'],
							where: {access_token: token, expiration: {gte: new Date()}}
						})
						.then(function (token) {
							if (!token) return null;
							return Auth.update({
									expiration: moment().add(CONFIG.ENV.session.expiration_in_seconds, 'seconds')
								}, {where: {access_token: token.access_token}})
								.then(function () {
									return token;
								});
						});

				}
			}
		});

	return Auth;
};

module.exports = AuthModel;