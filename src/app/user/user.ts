import { UserRole } from './user-role.enum';
import { ActivationStatus } from './activation-status.enum';

export class User {
  constructor(
    public id: number,
    public name: string,
    public role: UserRole,
    public email = '',
    public password = '',
    public status: ActivationStatus = ActivationStatus.CREATED) {
  }

  /**
   * check, if user has one of the given roles
   */
  hasRole(...roles: UserRole[]) {
    for (const r of roles) {
      if (r === this.role) {
        return true;
      }
    }
    return false;
  }

  is(user: User) {
    return this.id === user.id;
  }
}
