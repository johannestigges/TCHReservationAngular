import { ReservationType } from './reservationtype';
import { User } from './../admin/user/user';
import { Occupation } from './occupation';

export class Reservation {

	public id: number;
	public occupations: Occupation[];

	constructor(
    public systemConfigId: number, //
    public user: User, //
    public text: string, //
    public date: number, // date of reservation in epocj ofMillies
    public start: number, // start time of reservation in epoch ofMillies
    public duration: number, //
    public courts: string, //
    public type: ReservationType, //
    public repeatType?: string, // null, daily, weekly
    public repeatUntil?: number) {
		this.id = Math.floor(Math.random() * 100000000);
	}

	setCourts(...courts: number[]) {
		this.courts = courts.join(' ');
	}

	addCourts(...courts: number[]) {
		this.courts = this.courts + courts.join(' ');
	}

	getCourts(): number[] {
		return this.courts.split(' ').map((court) => {
			return parseInt(court, 10);
		});
	}
}
