export enum ActivationStatus {
  CREATED, // created by the user, but not verified
  VERIFIED_BY_USER, // verified by user, but not verified by admin
  ACTIVE, // verified by user and by admin
  LOCKED, // locked due to too many login failures
  REMOVED // removed by user or by admin
}
