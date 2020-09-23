import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository';

import { startOfHour } from 'date-fns';

import AppError from '../errors/AppError';

interface Request {
    provider_id: string,
    parsedDate: Date
}


class CreateAppointmentService {
    //private appointmentsRepository: AppointmentsRepository;
    //constructor(appointmentsRepository: AppointmentsRepository) {
    //    this.appointmentsRepository = appointmentsRepository;
    //}

    public async execute({ provider_id, parsedDate  }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(AppointmentsRepository)
        const appointmentDate = startOfHour(parsedDate)

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked.');
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate
        })

        await appointmentsRepository.save(appointment);

        return appointment;
    };
};

export default CreateAppointmentService;
