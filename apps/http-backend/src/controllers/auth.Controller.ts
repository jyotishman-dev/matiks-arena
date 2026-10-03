import type { Request, Response } from "express";
import prisma from "@repo/db/client"
import { loginSchema, registerSchema } from "@repo/common/common"
import bcrypt from "bcryptjs";

import { config } from "../config";
import jwt from "jsonwebtoken";




export const registerController = async (req: Request, res: Response) => {
    const { success, data, error } = registerSchema.safeParse(req.body);


    if (!success) {
        res.status(403).json({
            message: "Please fill the details correctly "
        })

        return;
    }

    const { email, password } = data;

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        res.status(400).json({
            message: "User is already registered. Please Login"
        });
        return;
    }


    const user = await email.split("@")[0]!;

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            username: user,
        }
    })

    return res.status(201).json({
        message : "registration successfull"
    })
}



export const loginController = async (req: Request, res: Response) => {
    const { success, data } = loginSchema.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            message: "Please fill the details correctly"
        });
    }

    const { email, password } = data;
   
   

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign({userId : user.id}, config.JWT_SECRET)

    return res.status(200).json({
        message: "Login successful",
        data: { token }
    });
};




export const getMeController = async(req:Request, res: Response) =>{
    try {
        const  userId  = req.userId;

    const user = await prisma.user.findFirst({
        where:{id : userId},
        omit:{
            password : true
        },
        include : {
          rating : true ,
          gameMember:{
            include : {
                game : true
            }
          }
        }
    });


    return  res.json({message :"user Found", data :{ user }})


    } catch (error) {
        return res.status(400).json({message : "there was an error please fill the details "})
    }
 }