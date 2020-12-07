import { Request, Response, NextFunction } from 'express';
import authConfig from '@config/auth'
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

interface TokenPayload {
    iat: number,
    exp: number,
    sub: string
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction):void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token is missing');
    };

    const [, token] = authHeader.split(' ');
    // const [type, token] ...
    try {
        const decoded = verify(token, authConfig.jwt.secret)

        const { sub } = decoded as TokenPayload;

        request.user = {
            id: sub
        }

        return next();
    } catch (error) {
        throw new AppError('Invalid JWT token.', 401)
    }





}

export default ensureAuthenticated;
