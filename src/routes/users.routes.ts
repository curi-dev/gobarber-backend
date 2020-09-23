import multer from 'multer';
import { Router } from 'express';
import { hash } from 'bcryptjs';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateAvatarService';

import uploadConfig from '../config/upload';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {

        const updateUserAvatar = new UpdateUserAvatarService();

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename
        })
        delete user.password;

        return response.json({ user });

})

usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;
        const hashedPassword = await hash(password, 8);


        const createUser = new CreateUserService();

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
