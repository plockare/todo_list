import {Model, DataTypes} from 'sequelize';
import {Options, Attributes} from 'sequelize-decorators';
import modelManager from '../../modules/modelManager';

@Options({
  sequelize: modelManager.sequelize,
  tableName: 'todo_item'
})
@Attributes({
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  label: {type: DataTypes.STRING, allowNull: false},
  completed: {type: DataTypes.BOOLEAN, defaults: false},
  user_id: DataTypes.INTEGER,
  completed_at: DataTypes.DATE
})
export default class TodoItem extends Model {
};
