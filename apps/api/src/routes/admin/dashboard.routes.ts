
import { Router } from 'express';
import * as dashboardController from '../../controllers/admin/dashboardController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/stats', dashboardController.getDashboardStats);

export default router;
