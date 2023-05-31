import { Router } from 'express';
import UsersRoutes from './users';

const router = Router();

const usersRoutes = new UsersRoutes().getAllRoutes();
router.use('/users', usersRoutes);

export default router;
