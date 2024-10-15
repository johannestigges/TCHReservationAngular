
export enum WeekDays {
    MONDAY = 1, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

export type WeekDaysType = keyof typeof WeekDays;

export const weekDaysValues = Object.keys(WeekDays)
	.filter(key => isNaN(Number(key))) as WeekDaysType[];

export const weekDaysNames = [
	'Montag',
	'Dienstag',
	'Mittwoch',
	'Donnerstag',
	'Freitag',
	'Samstag',
	'Sonntag'
];
