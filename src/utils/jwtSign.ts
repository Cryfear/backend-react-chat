import * as dotenv from 'dotenv';

import jwt from "jsonwebtoken";

dotenv.config();

const secret = process.env.SESSION_SECRET as string;

export const generateToken = (payload: object, expiresIn?: string): string => {
  return jwt.sign(
    payload, 
    secret, 
    { 
      expiresIn: expiresIn || (process.env.JWT_MAXAGE as string) || '7d' 
    } as jwt.SignOptions
  );
};