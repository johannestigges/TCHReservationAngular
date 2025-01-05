import {UserRole} from './user-role.enum';
import {ActivationStatus} from './activation-status.enum';

export class User {
  constructor(
    public id: number,
    public name: string,
    public role: UserRole,
    public email: string = '',
    public password: string = '',
    public status = ActivationStatus.ACTIVE) {
  }

  static from(user: User) {
    return new User(user.id, user.name, user.role, user.email, user.password, user.status)
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

  static readonly EMPTY = new User(0, '', UserRole.ANONYMOUS, '', '', ActivationStatus.CREATED);
}
