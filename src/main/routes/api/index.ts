import { Router } from 'express';
import userRoutes from './user.routes';

const apiRoutes = Router();

apiRoutes.use('/user', userRoutes);

export default apiRoutes;
