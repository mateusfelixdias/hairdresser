import { Router } from 'express';
import AuthMiddleware from '../../middlewares/auth';
import ConfigMulter from '../../config/configMulter';
import UsersController from '../../controllers/users';

export default class UsersRoutes {
  private router: Router;
  private configMulter: ConfigMulter;
  private authMiddleware: AuthMiddleware;
  private usersController: UsersController;

  constructor() {
    this.router = Router();
    this.configMulter = new ConfigMulter();
    this.authMiddleware = new AuthMiddleware();
    this.usersController = new UsersController();
  }

  getAllRoutes() {
    const authMiddleware = this.authMiddleware.auth.bind(this.authMiddleware);

    const store = this.usersController.store.bind(this.usersController);
    this.router.post('/', store);

    const configMulter = this.configMulter;
    const uploadAvatarMiddleware = configMulter.upload().single('avatarUrl');
    const update = this.usersController.update.bind(this.usersController);
    this.router.put('/', authMiddleware, uploadAvatarMiddleware, update);

    const auth = this.usersController.auth.bind(this.usersController);
    this.router.post('/auth', auth);

    return this.router;
  }
}
