import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OccupationService } from '../occupation.service';
import { OccupationSystemConfig } from '../occupation-system-config';
import { Occupation } from '../occupation';
import { OccupationType } from '../occupationtype';
import { OccupationTable } from './occupation-table';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UserRole } from '../../user/user-role.enum';

@Component({
  selector: 'app-root',
  templateUrl: './occupation-table.component.html',
  styleUrls: ['./occupation-table.component.css']
})
export class OccupationTableComponent {

  private occupationTable: OccupationTable;
  private user: User;
  private systemConfig: OccupationSystemConfig;

  constructor(private occupationService: OccupationService,
    private userService: UserService,
    private route: ActivatedRoute) {
    this.systemConfig = occupationService.getSystemConfig(route.snapshot.params['system']);
    this.user = this.userService.getUser(route.snapshot.params['user']);
    this.occupationTable = new OccupationTable(this.user, this.systemConfig);
    this.update(new Date());
  }

  public canModify(occupation: Occupation) {
    return this.user.hasRole(UserRole.ADMIN) || occupation.userid == this.user.id;
  }

  private show(occupations: Occupation[]) {
    this.occupationTable.occupations = occupations;
    this.occupationTable.show();
  }

  update(date: Date) {
    this.occupationService.getOccupations(date).subscribe(o => this.show(o));
  }
}