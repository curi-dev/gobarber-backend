import { getRepository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';

interface Request {
    name: string,
    email: string,
    password: string
}

class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const checkUserExists = await usersRepository.findOne({
            where: { email }
        })

        if (checkUserExists) {
            throw new AppError('This email is already taken.')
        };

        const user = usersRepository.create({
            name,
            email,
            password
        });

        await usersRepository.save(user);

        return user;
    }
}


export default CreateUserService;
