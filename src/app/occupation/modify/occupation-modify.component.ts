import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OccupationService } from '../occupation.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { Occupation } from '../occupation';
import { OccupationType } from '../occupationtype';
import { OccupationSystemConfig } from '../occupation-system-config';


@Component({
  selector: 'occupation-modify',
  templateUrl: './occupation-modify.component.html',
  styleUrls: ['./occupation-modify.component.css']
})
export class OccupationModifyComponent {

  user: User;
  systemConfig: OccupationSystemConfig;
  occupation: Occupation;

  constructor(private route: ActivatedRoute,
    private location: Location,
    private service: OccupationService,
    private userService: UserService) {
    this.user = userService.getUser(route.snapshot.params['user']);
    this.systemConfig = service.getSystemConfig(route.snapshot.params['system']);
    service.getOccupation(route.snapshot.params['reservation']).subscribe(o => this.occupation = o);
}

  onDelete() {
    console.log(this.occupation);
    this.service.delete(this.occupation.id);
    this.location.back();
  }

  onBack() {
    this.location.back();
  }
}
