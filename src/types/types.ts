import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: { username: string; sub: string }; 
  }
}