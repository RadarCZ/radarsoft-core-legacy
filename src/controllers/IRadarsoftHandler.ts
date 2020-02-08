import { Request, Response, NextFunction } from 'express';

export type IRadarsoftHandler = (req: Request, res: Response, next?: NextFunction | undefined) => void;
