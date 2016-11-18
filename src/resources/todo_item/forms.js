import validation from '../../modules/validation';
import { messages as errorMessages } from '../../modules/error';
import consts from './consts';

const create = {
  label: {
    notEmpty: true,
    errorMessage: errorMessages.required
  }
};

const updateState = {
  state: {
    notEmpty: true,
    errorMessage: errorMessages.required,
    has: {
      options: [consts.STATE]
    }
  }
};

export default {
  create: validation.checkBody(create),
  update: validation.checkBody(create),
  updateState: validation.checkBody(updateState)
};
