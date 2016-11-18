import { Router } from 'express';
import policy from '../../modules/policy';
import forms from './forms';
import * as controller from './controller';
import validation from '../../modules/validation';

const url = '/todo-item';
const router = new Router();


router.get(
  `${url}`,
  [
    policy.isSignedIn,
    validation.checkListOptions
  ],
  controller.list
);

router.post(
  `${url}`,
  [
    policy.isSignedIn,
    forms.create
  ],
  controller.create
);

router.put(
  `${url}/:id`,
  [
    policy.isSignedIn,
    validation.checkId('id'),
    forms.update
  ],
  controller.update
);

router.get(
  `${url}/:id`,
  [
    policy.isSignedIn,
    validation.checkId('id')
  ],
  controller.detail
);

router.delete(
  `${url}/:id`,
  [
    policy.isSignedIn,
    validation.checkId('id')
  ],
  controller.remove
);

router.put(
  `${url}/:id/state`,
  [
    policy.isSignedIn,
    validation.checkId('id'),
    forms.updateState
  ],
  controller.updateState
);

export default router;
