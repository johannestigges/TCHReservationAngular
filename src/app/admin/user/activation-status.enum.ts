export enum ActivationStatus {
  CREATED, // created by the user, but not verified
  VERIFIED_BY_USER, // verified by user, but not verified by admin
  ACTIVE, // verified by user and by admin
  LOCKED, // locked due to too many login failures
  REMOVED // removed by user or by admin
}

export type ActivationStatusType = keyof typeof ActivationStatus;

export const activationStatusValues = Object.keys(ActivationStatus)
	.filter(key => isNaN(Number(key))) as ActivationStatusType[];

export const activationStatusFrom =
  (status: unknown): ActivationStatus => ActivationStatus[status as ActivationStatusType];
