import { UserRole } from './user-role.enum';
import { ActivationStatus } from './activation-status.enum';

export class User {
  constructor(
    public id: number,
    public name: string,
    public role: UserRole,
    public email = "",
    public password = "",
    public status = ActivationStatus.CREATED) {
  }

  /**
   * check, if user has one of the given roles
   */
  hasRole(...roles) {
    for (var i = 0; i < roles.length; i++) {
      if (roles[i] == this.role) {
        return true;
      }
    }
    return false;
  }
}
