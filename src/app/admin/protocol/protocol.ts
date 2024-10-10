import { User } from '../user/user';

export class Protocol {
	constructor(
    public id: number,
    public time: number,
    public entityType: string,
    public entityId: number,
    public actionType: string,
    public value: string,
    public oldValue: string,
    public user: User
	) {
	}
}
