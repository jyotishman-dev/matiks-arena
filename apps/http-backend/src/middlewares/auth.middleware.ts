import type { NextFunction , Request, Response } from "express";
import { verify, type JwtPayload } from "jsonwebtoken";
import { config } from "../config";


export const auth  = async(req: Request , res : Response , next : NextFunction) => {

    try {
        const bearerToken = req.headers.authorization;

    if(!bearerToken) {
        res.status(401).json({message : "invalid token"})
        return ;
    }

    const extractedToken = bearerToken.split("Bearer ")[1]

      if(!extractedToken) {
        res.status(401).json({message : "invalid token"})
        return ;
    }


    const decoded = verify(extractedToken , config.JWT_SECRET) as JwtPayload;


   req.userId = decoded.userId;
   next();
        
    } catch (error) {
        res.status(401).json({message : "invalid token"})
    }
}
