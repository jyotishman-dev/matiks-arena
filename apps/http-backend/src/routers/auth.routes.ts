import { Router } from "express";
import { getMeController, loginController, registerController } from "../controllers/auth.Controller";
import { auth } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/me', auth, getMeController);

export default authRouter;