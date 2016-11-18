import uuid from 'node-uuid';
import {Model, DataTypes} from 'sequelize';
import {Options, Attributes} from 'sequelize-decorators';
import config from 'cfg-loader';
import modelManager from '../../modules/modelManager';

const expiration = modelManager.sequelize.fn('DATE_ADD', modelManager.sequelize.fn('NOW'), modelManager.sequelize.literal(`INTERVAL '${config.server.expiration_in_seconds}' SECOND`));

@Options({
  sequelize: modelManager.sequelize,
  tableName: 'access_token',
  paranoid: false,
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['access_token']
    }
  ]
})
@Attributes({
  access_token: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
  expiration: DataTypes.DATE
})
export default class AccessToken extends Model {
  static associate() {
    this.belongsTo(modelManager.getModel('user'), {foreignKey: 'user_id'});
  }

  static createAccessToken(user) {
    console.log(user);
    const uid = uuid.v4();
    return this.create({
      user_id: user.id,
      access_token: uid,
      expiration
    });
  }

  static getToken(token) {
    return this
      .find({
        attributes: ['id', 'user_id', 'access_token'],
        where: {
          access_token: token,
          expiration: {gte: modelManager.sequelize.fn('NOW')}
        }
      })
      .then((token) => {
        if (!token) return null;
        return this
          .update(
            {expiration},
            {where: {access_token: token.access_token}}
          )
          .then(() => token);
      });
  }
};
