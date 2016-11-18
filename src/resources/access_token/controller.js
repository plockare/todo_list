import modelManager from '../../modules/modelManager';
import APIError, { messages as errorMessages } from '../../modules/error';

const authModel = modelManager.getModel('access_token');
const userModel = modelManager.getModel('user');

export function login(req, res, next) {
  userModel
    .findByCredentials(req.body.email, req.body.password)
    .then((user) => {
      if (!user) {
        throw new APIError(errorMessages.invalid_credentials, 400);
      }
      return authModel.createAccessToken(user)
        .then((result) => ({access_token: result.access_token}));
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(next);
}

export function logout(req, res, next) {
  authModel
    .destroy({where: {access_token: req.session.access_token}})
    .then(() => res.sendStatus(204))
    .catch(next);
}
