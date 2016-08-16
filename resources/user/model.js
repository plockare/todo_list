var crypto = require('crypto');
var modelManager = require(CONFIG.module_path + '/modelManager');

function encryptPassword(email, password) {
	return crypto.createHmac('sha1', email).update(password).digest('hex');
}

function UserModel(sequelize, DataTypes) {
	var User = sequelize.define(CONFIG.db.tables.user, {
		user_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		name: DataTypes.STRING,
		name_prefix: DataTypes.STRING,
		middle_name: DataTypes.STRING,
		surname: DataTypes.STRING,
		name_suffix: DataTypes.STRING
	}, {
		indexes: [{
			unique: true,
			fields: ['email']
		}],
		classMethods: {
			defaultProjection: ['name', 'surname', 'email', 'name_prefix', 'name_suffix', 'middle_name'],
			defaultProjectionId: ['user_id', 'name', 'surname', 'email', 'name_prefix', 'name_suffix', 'middle_name'],
			defaultProjectionIdDeleted: ['user_id', 'name', 'surname', 'email', 'name_prefix', 'name_suffix', 'middle_name', 'deleted_at'],
			searchAbles: ['name', 'surname', 'email', 'name_prefix', 'name_suffix', 'middle_name'],
			encryptPassword: encryptPassword,
			findByCredentials: function (email, password) {
				return User.findOne({
					attributes: ['user_id'],
					where: {
						email: email,
						password: encryptPassword(email, password)
					}
				})
			}
		}
	});

	return User;
}

module.exports = UserModel;