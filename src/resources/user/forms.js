import validation from '../../modules/validation';
import { messages as errorMessages } from '../../modules/error';

const register = {
  email: {
    notEmpty: true,
    isEmail: {
      errorMessage: errorMessages.email
    },
    errorMessage: errorMessages.required
  },
  password: {
    notEmpty: true,
    errorMessage: errorMessages.required
  }
};

export default {
  register: validation.checkBody(register)
};
