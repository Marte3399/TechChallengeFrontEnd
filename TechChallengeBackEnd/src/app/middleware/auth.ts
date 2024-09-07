import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import IUser from "../interfaces/IUser";

export interface CustomRequest extends Request {
    username?: string
    _id?: number
    token?: string
  }

  interface DecodedToken {
    _id: number
    username:string
  }

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try{
        const decoded = jwt.verify(token, process.env.JWT_KEY as string) as DecodedToken
        req.username = decoded.username
        req.token = token
        req._id = decoded._id
        next();
    }
    catch{
        return res.status(403).json({ message: 'Invalid token' });
    }

  };