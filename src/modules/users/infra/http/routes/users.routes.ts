import multer from 'multer';
import { Router } from 'express';
import { hash } from 'bcryptjs';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateAvatarService';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
        const usersRepository = new UsersRepository();
        const updateUserAvatar = new UpdateUserAvatarService(usersRepository);

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename
        })
        delete user.password;

        return response.json({ user });

})

usersRouter.post('/', async (request, response) => {
    const usersRepository = new UsersRepository();
    try {
        const { name, email, password } = request.body;
        const hashedPassword = await hash(password, 8);


        const createUser = new CreateUserService(usersRepository);

        const user = await createUser.execute({
            name,
            email,
            password: hashedPassword
        });

        delete user.password;

        return response.json(user);
    } catch (err) {
        return response.status(400).json({ error: err.message })
    }

});

export default usersRouter;
