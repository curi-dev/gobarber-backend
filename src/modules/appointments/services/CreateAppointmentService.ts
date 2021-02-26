import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentRepository from '../repositories/IAppointmentsRepository';

import { startOfHour } from 'date-fns';

import AppError from '../../../shared/errors/AppError';

interface Request {
    provider_id: string,
    parsedDate: Date
}


class CreateAppointmentService {
    constructor(private appointmentsRepository: IAppointmentRepository) {};

    public async execute({ provider_id, parsedDate  }: Request): Promise<Appointment> {
        const appointmentDate = startOfHour(parsedDate)

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked.');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate
        })

        return appointment;
    };
};

export default CreateAppointmentService;
