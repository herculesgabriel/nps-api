import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

class ErrorController {
  execute(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof AppError) {
      return res
        .status(error.statusCode)
        .json(error.message);
    }

    return res
      .status(500)
      .json({ error: `Internal server error ${error.message}` });
  }
}

export default new ErrorController;
