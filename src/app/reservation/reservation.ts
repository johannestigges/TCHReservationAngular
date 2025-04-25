import { User } from '../admin/user/user';
import { Occupation } from './occupation';

export class Reservation {

	public id: number | null = null;
	public occupations: Occupation[] = [];

	constructor(
    public systemConfigId: number, //
    public user: User, //
    public text: string, //
    public date: number, // date of reservation in epocj ofMillies
    public start: number, // start time of reservation in epoch ofMillies
    public duration: number, //
    public courts: string, //
    public type: number, //
    public repeatType?: string, // null, daily, weekly
    public repeatUntil?: number) {
	}

	static readonly EMPTY = new Reservation(0,User.EMPTY,'',0,0,0,'',0,undefined,undefined);
}
