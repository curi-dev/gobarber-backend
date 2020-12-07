import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

export default interface IAppointmensRepository {
    findByDate(date: Date): Promise<Appointment | undefined>;
}

