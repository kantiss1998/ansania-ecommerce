
import { Router } from 'express';
import * as adminVoucherController from '../../controllers/admin/voucherController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', adminVoucherController.getAllVouchers);
router.get('/:id', adminVoucherController.getVoucherDetail);
router.post('/', adminVoucherController.createVoucher);
router.put('/:id', adminVoucherController.updateVoucher);
router.delete('/:id', adminVoucherController.deleteVoucher);

export default router;
