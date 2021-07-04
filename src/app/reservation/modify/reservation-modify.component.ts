import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ReservationType } from '../reservationtype';
import { ReservationService } from '../reservation.service';
import { ReservationSystemConfig } from '../reservation-system-config';
import { ErrorAware } from '../../util/error/error-aware';

import { UserService } from '../../admin/user/user.service';
import { User } from '../../admin/user/user';
import { UserRole } from '../../admin/user/user-role.enum';
import { DateUtil } from '../../util/date/date-util';
import { Occupation } from '../occupation';
import { ActivationStatus } from '../../admin/user/activation-status.enum';

@Component({
    selector: 'tch-reservation-modify',
    templateUrl: './reservation-modify.component.html',
    styleUrls: ['./reservation-modify.component.css']
})
export class ReservationModifyComponent extends ErrorAware implements OnInit, OnDestroy {

    systemConfig: ReservationSystemConfig;
    user: User;
    occupation: Occupation;

    time: number;
    type: string;
    court: number;

    types: string[];

    showType: boolean;
    focus: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: ReservationService,
        private userService: UserService) {
        super();
    }

    ngOnInit() {
        const systemId = this.route.snapshot.params.system;
        const occupationId: number = this.route.snapshot.params.occupation;
        this.showType = false;
        this.focus = 'date';

        // create option list of reservation types
        this.types = Object.keys(ReservationType).map(key => ReservationType[key])
            .filter(value => typeof value === 'string');

        this.service.getSystemConfig(systemId).subscribe(
            config => {
                this.systemConfig = ReservationSystemConfig.of(config);
                this.userService.getLoggedInUser().subscribe(
                    user => {
                        this.user = new User(user.id, user.name, UserRole['' + user.role], ActivationStatus['' + user.status]);
                        this.service.getOccupation(occupationId).subscribe(
                            occupation => {
                                this.occupation = occupation;
                                this.time = this.occupation.start;
                                this.type = ReservationType[this.occupation.type];
                                this.court = this.occupation.court;
                                this.update();
                            },
                            occupationerror => this.httpError = occupationerror
                        );
                    },
                    usererror => this.httpError = usererror
                );
            },
            configerror => this.httpError = configerror
        );
    }

    ngOnDestroy(): void {
        this.occupation = undefined;
        this.user = undefined;
        this.systemConfig = undefined;
        this.clearError();
    }

    private update() {
        // decide which parts of the layout are visible
        // this depends on the user role
        this.showType = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER, UserRole.TEAMSTER);
        if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER, UserRole.TEAMSTER)) { this.focus = 'date'; }
        if (this.user.hasRole(UserRole.TRAINER)) { this.focus = 'duration'; }
        if (this.user.hasRole(UserRole.REGISTERED)) { this.focus = 'duration'; }
        if (this.user.hasRole(UserRole.KIOSK)) { this.focus = 'text'; }
    }

    public canEdit(): boolean {
        if (!this.occupation) {
            return false;
        }
        if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
            return true;
        }
        if (this.user.id === this.occupation.reservation.user.id) {
            return true;
        }
        return false;
    }

    public canTerminate() {
        if (!this.occupation) {
            return false;
        }
        const start = DateUtil.ofDateAndTime(this.occupation.date, this.occupation.start).getTime();
        const end = this.systemConfig.getReservationEnd(this.occupation.reservation);
        const now = DateUtil.now();
        return start < now && end > now;
    }

    canDelete() {
        if (!this.occupation) {
            return false;
        }
        return this.canEdit();
    }

    getDate() {
        if (this.occupation) {
            return DateUtil.toDate(this.occupation.date).toLocaleDateString();
        }
    }

    duration(d: number) {
        return new Date(d).toLocaleTimeString();
    }

    onDurationChanged(duration: number) {
        this.occupation.duration = duration;
    }

    getTimes() {
        if (this.systemConfig) {
            const times = [];
            for (let hour = this.systemConfig.openingHour; hour < this.systemConfig.closingHour; hour++) {
                for (let minute = 0; minute < 60; minute += this.systemConfig.durationUnitInMinutes) {
                    times.push((hour * 60 + minute) * DateUtil.MINUTE);
                }
            }
            return times;
        }
    }

    onDelete() {
        this.clearError();
        this.service.deleteOccupation(this.occupation.id)
            .subscribe(
                data => this.onBack(),
                err => this.httpError = err
            );
    }

    onTerminate() {
        this.clearError();
        const now = new Date().getTime();
        while (this.systemConfig.getOccupationEnd(this.occupation) > now) {
            this.occupation.duration--;
        }
        if (this.occupation.duration > 0) {
            this.service.updateOccupation(this.occupation)
                .subscribe(
                    data => this.onBack(),
                    error => this.httpError = error
                );
        } else {
            this.service.deleteOccupation(this.occupation.id)
                .subscribe(
                    data => this.onBack(),
                    error => this.httpError = error
                );
        }
    }

    onUpdate() {
        this.clearError();
        this.occupation.type = ReservationType[this.type];
        this.occupation.start = this.time;
        if (this.court !== this.occupation.court) {
            this.occupation.court = this.court;
            this.occupation.lastCourt = this.court;
        }
        this.service.updateOccupation(this.occupation)
            .subscribe(
                data => this.onBack(),
                err => this.httpError = err
            );
    }

    onBack() {
        this.router.navigate(['/table', this.systemConfig.id, this.occupation.date]);
    }
}
