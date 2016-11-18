import { Router } from 'express';
import forms from './forms';
import controller from './controller';

const url = '/authentication';
const router = new Router();

router.post(
  `${url}/register`,
  forms.register,
  controller.register
);

export default router;
