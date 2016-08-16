'use strict'

var modelManager = require(CONFIG.module_path + '/modelManager');
function TodoItemModel(sequelize, DataTypes) {
	var TodoItem = sequelize.define('todo_item', {
			id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
			label: {type: DataTypes.STRING, allowNull: false},
			completed: {type: DataTypes.BOOLEAN, defaults: false},
			user_id: DataTypes.INTEGER,
			completed_at: DataTypes.DATE
		},
		{});
	return TodoItem;
}

module.exports = TodoItemModel;
