import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';



@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment>{
    //private appointments: Appointment[];

    //constructor() {
    //    this.appointments = [];
    //};

    //public All(): Appointment[] {
    //    return this.appointments;
    //}

    public async findByDate(date: Date): Promise<Appointment | null> {
        //const findAppointment = this.appointments.find(appointment =>
        //    isEqual(date, appointment.date),
        //);
        //return findAppointment || null
        const findAppointment = await this.findOne({
            where: { date }
        });

        console.log(findAppointment)
        return findAppointment || null;
    };



    //public create({ provider, date }: CreateAppointmentDTO): Appointment {
    //    const appointment = new Appointment({
    //        provider,
    //        date
    //    });
    //    this.appointments.push(appointment);
    //    return appointment;
    //};

}

export default AppointmentsRepository;
