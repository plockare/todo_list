class Policy {

  init(config, modelManager, error, errorMessages) {
    this.config = config;
    this.modelManager = modelManager;
    this.Error = error;
    this.errorMessages = errorMessages;
  }

  isSignedIn = (req, res, next) => {
    const access_token = req.headers[this.config.server.access_token] || req.query[this.config.server.access_token] || false;
    if (!access_token) {
      return next(new this.Error(this.errorMessages.no_access_token, 401));
    }
    const authModel = this.modelManager.getModel('access_token');
    authModel
      .getToken(access_token)
      .then((token) => {
        if (!token) throw new this.Error(this.errorMessages.unauthorized, 401);
        req.session = token;
        if (req.method === 'PUT') {
          req.body.updated_by_user_id = req.session.user_id;
        } else if (req.method === 'POST') {
          req.body.created_by_user_id = req.session.user_id;
        }
        next();
      })
      .catch(next);
  }
}

export default new Policy();

