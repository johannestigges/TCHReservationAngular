export enum UserRole {
  ANONYMOUS,
  REGISTERED,
  KIOSK,
  TRAINER,
  ADMIN,
  TECHNICAL,
  TEAMSTER,
  GUEST
}

export type UserRoleType = keyof typeof UserRole;

export const userRoleValues = Object.keys(UserRole).filter(key => isNaN(Number(key))) as UserRoleType[];

export const userRoleNames = [
  'nicht angemeldet',
  'Mitglied',
  'Kiosk',
  'Trainer',
  'Administrator',
  'Mitglied (technisch)',
  'Mannschaftsführer',
  'Gast'
];

export function userRoleFrom(value: unknown): UserRole {
	return UserRole[value as UserRoleType];
}
