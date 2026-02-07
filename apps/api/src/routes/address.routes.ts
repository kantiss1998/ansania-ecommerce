
import { Router } from 'express';
import * as addressController from '../controllers/addressController';
import { validateRequest } from '../middleware/validation';
import { addressSchemas } from '@repo/shared/schemas';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post(
    '/',
    validateRequest(addressSchemas.create),
    addressController.createAddress
);

router.get('/', addressController.getAddresses);

router.get('/:id', addressController.getAddress);

router.put(
    '/:id',
    validateRequest(addressSchemas.update),
    addressController.updateAddress
);

router.delete('/:id', addressController.deleteAddress);

router.patch('/:id/set-default', addressController.setDefaultAddress);

export default router;

