import { Router } from 'express';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import { parseISO } from 'date-fns';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

//appointmentsRouter.get('/', async (request, response) => {
//    const appointments = await appointmentsRepository.find();

//    return response.json(appointments);
//});


appointmentsRouter.post('/', async (request, response) => {
    const appointmentsRepository = new AppointmentsRepository();
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date)

    const createAppointmentService = new CreateAppointmentService(appointmentsRepository);

    const appointment = await createAppointmentService.execute({
        provider_id,
        parsedDate: parsedDate
    })

    return response.json(appointment);

});

export default appointmentsRouter;
