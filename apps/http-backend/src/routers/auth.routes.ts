import { Router } from "express";
import { registerController } from "../controllers/auth.Controller";

const authRouter = Router()


authRouter.post('/register', registerController )





export default authRouter