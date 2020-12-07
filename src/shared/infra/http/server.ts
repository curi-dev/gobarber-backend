import 'reflect-metadata';
import express, { Request, Response, NextFunction} from 'express';
import 'express-async-errors';
import routes from '../../routes/index'
import cors from 'cors';

import '../typeorm';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            error: 'error',
            message: err.message
        });
    };

    console.log(err)

    return response.json({
        error: 'error',
        message: 'Internal Server Error.'
    });

});

app.listen(3333, ()  => {
    console.log("🚀 Backend started on port 3333!")
});

export default app;

