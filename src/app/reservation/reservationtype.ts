export enum ReservationType {
  Quickbuchung,
  Training,
  Meisterschaft,
  Dauerbuchung,
  Gesperrt
}

export type ReservationTypeType = keyof typeof ReservationType;

export const reservationTypeValues = Object.keys(ReservationType)
	.filter(key => isNaN(Number(key))) as ReservationTypeType[];

export function reservationTypeFrom(value: unknown): ReservationType {
	return ReservationType[value as ReservationTypeType];
}
