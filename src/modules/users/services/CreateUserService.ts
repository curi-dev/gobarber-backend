import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

interface Request {
    name: string,
    email: string,
    password: string
}

class CreateUserService {
    constructor(private usersRepository: IUsersRepository) {};

    public async execute({ name, email, password }: Request): Promise<User> {
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError('This email is already taken.')
        };

        const user = await this.usersRepository.create({
            name,
            email,
            password
        });

        return user;
    }
}


export default CreateUserService;
