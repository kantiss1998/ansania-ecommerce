
import { Router } from 'express';
import * as attributeController from '../controllers/attributeController';

const router = Router();

router.get('/', attributeController.getAllAttributes);
router.get('/colors', attributeController.getColors);
router.get('/sizes', attributeController.getSizes);
router.get('/finishings', attributeController.getFinishings);

export default router;
