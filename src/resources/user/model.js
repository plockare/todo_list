import crypto from 'crypto';
import {Model, DataTypes} from 'sequelize';
import {Options, Attributes} from 'sequelize-decorators';
import modelManager from '../../modules/modelManager';


@Options({
  sequelize: modelManager.sequelize,
  tableName: 'user',
  paranoid: false,
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ],
  defaultScope: {
    attributes: ['user_id', 'name', 'surname', 'email', 'name_prefix', 'name_suffix', 'middle_name']
  }
})
@Attributes({
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  name: DataTypes.STRING,
  name_prefix: DataTypes.STRING,
  middle_name: DataTypes.STRING,
  surname: DataTypes.STRING,
  name_suffix: DataTypes.STRING
})
export default class User extends Model {
  static associate() {
    this.belongsTo(modelManager.getModel('user'), {foreignKey: 'user_id'});
  }

  get searchAbles() {
    return ['name', 'surname', 'email', 'name_prefix', 'name_suffix', 'middle_name'];
  }

  static encryptPassword(password) {
    const salt = crypto.randomBytes(128).toString('hex');
    return salt + crypto.pbkdf2Sync(password, salt, 10000, 512).toString('hex');
  }

  static validate(hash, password) {
    const salt = hash.substr(0, 256);
    return hash === salt + crypto.pbkdf2Sync(password, salt, 10000, 512).toString('hex');
  }

  static findByCredentials(email, password) {
    return this
      .findOne({
        attributes: ['id', 'password'],
        where: {
          email
        }
      })
      .then((user) => {
        if (user == null) return null;
        if (!this.validate(user.password, password)) return null;
        return {
          id: user.id
        };
      });
  }
}
