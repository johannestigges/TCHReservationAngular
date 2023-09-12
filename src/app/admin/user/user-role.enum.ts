export enum UserRole {
  ANONYMOUS,
  REGISTERED,
  KIOSK,
  TRAINER,
  ADMIN,
  TECHNICAL,
  TEAMSTER
}

export type UserRoleType = keyof typeof UserRole;

export const userRoleValues = Object.keys(UserRole).filter(key => isNaN(Number(key))) as UserRoleType[];

export function userRoleFrom(value: unknown): UserRole {
	return UserRole[value as UserRoleType];
}
