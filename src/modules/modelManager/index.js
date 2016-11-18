import path from 'path';
import fs from 'fs';
import Sequelize from 'sequelize';

class ModelManager {

  _config;
  _Sequelize;
  _sequelize;
  _resourcePath;

  init(config, logger, resourcePath) {
    this._config = config;
    const configuration = config.postgres;
    configuration.define = {freezeTableName: true, underscored: true, paranoid: true};
    configuration.logging = configuration.show_logs_db ? logger.info.bind(logger) : false;
    this._Sequelize = Sequelize;
    this._sequelize = new Sequelize(configuration.database, configuration.user, configuration.password, configuration);
    this._resourcePath = resourcePath;
  }

  get Sequelize() {
    return this._Sequelize;
  }

  get sequelize() {
    return this._sequelize;
  }

  get transaction() {
    return this._sequelize.transaction;
  }

  getModel(name) {
    let m = this._sequelize.modelManager.getModel(name, {attribute: 'tableName'});
    if (!m) {
      const modelPath = path.join(this._resourcePath, name, 'model.js');
      if (!fs.existsSync(modelPath)) {
        throw new Error(`Path '${modelPath}' does not exist`);
      }
      m = require(modelPath);
      this._sequelize.modelManager.addModel(m);
      if ('associate' in m) {
        m.associate();
      }
    }
    return m;
  }

  getSearchQuery(searchAbles, searchString) {
    if (!searchString) {
      return null;
    }
    const arr = [];
    searchAbles.forEach((col) => {
      if (typeof col === 'object') {
        arr.push(this._sequelize.where(col, {$like: `%${searchString}%`}));
      } else {
        const o = {};
        o[col] = {$like: `%${searchString}%`};
        arr.push(o);
      }
    });
    return arr;
  }

  addLimit(query, options) {
    if (options.limit && options.offset) {
      return {
        query: `${query} LIMIT ?,?`,
        params: [options.offset, options.limit]
      };
    } else if (options.limit) {
      return {
        query: `${query} LIMIT ?`,
        params: [options.limit]
      };
    }
    return {
      query,
      params: []
    };
  }
}

export default new ModelManager();
