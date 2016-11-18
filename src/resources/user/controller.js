import modelManager from '../../modules/modelManager';

const userModel = modelManager.getModel('user');

export default {
  register(req, res, next) {
    req.body.password = userModel.encryptPassword(req.body.password);
    userModel
      .create(req.body)
      .then(() => res.sendStatus(201))
      .catch(next);
  }
};
