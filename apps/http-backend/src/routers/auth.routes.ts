import { Router } from "express";
import { getMeController, loginController, registerController } from "../controllers/auth.Controller";

const authRouter = Router()


authRouter.post('/register', registerController )
authRouter.post('/login', loginController)
authRouter.post('/me', getMeController)




export default authRouter