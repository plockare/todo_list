import { Router } from 'express';
import forms from './forms';
import controller, { detail } from './controller';
import policy from '../../modules/policy';

const url = '/authentication';
const router = new Router();

router.post(
  `${url}/register`,
  forms.register,
  controller.register
);

router.get(
  `/user/detail/:id`,
  [policy.isSignedIn],
  detail
);

export default router;
