import User from '../infra/typeorm/entities/User';
import authConfig from '../../../config/auth';

import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';


interface Request {
    email: string,
    password: string
}

interface Response {
    user: User,
    token: string
}

class AuthenticateUserService {
    constructor(private sessionRepository: IUsersRepository) {};

    public async execute({ email, password }: Request): Promise<Response> {
        const user = await this.sessionRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorret email/password combination.', 401)
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorret email/password combination.', 401)
        }

        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn
            }
        )

        return {
            user,
            token
        };
    }
}

export default AuthenticateUserService;
