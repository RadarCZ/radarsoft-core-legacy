import { Request, Response, NextFunction } from 'express';

export type IRadarsoftHandler = (req: Request, res: Response, next?: NextFunction) => void;

export type IAsyncRadarsoftHandler = (req: Request, res: Response, next?: NextFunction) => Promise<void>;
