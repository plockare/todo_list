import { Router } from 'express';
import policy from '../../modules/policy';
import forms from './forms';
import * as controller from './controller';

const url = '/authentication';
const router = Router();

router.post(
  `${url}/login`,
  forms.login,
  controller.login
);

router.get(
  `${url}/logout`,
  policy.isSignedIn,
  controller.logout
);


export default router;
