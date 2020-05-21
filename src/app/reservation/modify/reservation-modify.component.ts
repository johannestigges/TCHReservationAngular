import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ReservationType } from '../reservationtype';
import { ReservationService } from '../reservation.service';
import { ReservationSystemConfig } from '../reservation-system-config';
import { Reservation } from '../reservation';
import { ErrorAware } from '../../error/error-aware';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UserRole } from '../../user/user-role.enum';
import { DateUtil } from '../../date/date-util';

@Component({
    selector: 'tch-reservation-modify',
    templateUrl: './reservation-modify.component.html',
    styleUrls: ['./reservation-modify.component.css']
})
export class ReservationModifyComponent extends ErrorAware implements OnInit, OnDestroy {

    systemConfig: ReservationSystemConfig;
    user: User;
    reservation: Reservation;

    repeat: number;
    time: number;
    type: string;

    types: string[];

    showType: boolean;
    showRepeat: boolean;
    focus: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: ReservationService,
        private userService: UserService) {
        super();
    }

    ngOnInit() {
        this.systemConfig = this.service.getSystemConfig(this.route.snapshot.params.system);
        this.showType = false;
        this.showRepeat = false;
        this.focus = 'date';

        const reservationId: number = this.route.snapshot.params.reservation;

        // create option list of occupation types
        this.types = Object.keys(ReservationType).map(key => ReservationType[key])
            .filter(value => typeof value === 'string');

        this.service.getReservation(reservationId).subscribe(
            data => {
                this.reservation = data;
                this.time = this.reservation.start;
                this.type = ReservationType[this.reservation.type];
                this.update();
            },
            err => {
                this.httpError = err;
            }
        );

        this.userService.getLoggedInUser().subscribe(
            data => {
                this.user = new User(data.id, data.name, UserRole['' + data.role]);
                this.update();
            },
            err => {
                this.httpError = err;
            }
        );

    }
    ngOnDestroy(): void {
        this.reservation = undefined;
        this.user = undefined;
        this.clearError();
    }

    private update() {
        if (!this.reservation || !this.user) {
            return;
        }

        // decide which parts of the layout are visible
        // this depends on the user role
        this.showType = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
        this.showRepeat = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
        if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) { this.focus = 'date'; }
        if (this.user.hasRole(UserRole.TRAINER)) { this.focus = 'duration'; }
        if (this.user.hasRole(UserRole.REGISTERED)) { this.focus = 'duration'; }
        if (this.user.hasRole(UserRole.KIOSK)) { this.focus = 'text'; }
    }

    private canEdit(): boolean {
        if (!this.user || !this.reservation) {
            return false;
        }
        if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
            return true;
        }
        if (this.user.id === this.reservation.user.id) {
            return true;
        }
        return false;
    }

    public canMakeAvailable() {
        return this.isReservationCurrent();
    }

    public isReservationCurrent() {
        const now = new Date().getTime();
        const start = DateUtil.ofDateAndTime(this.reservation.date, this.reservation.start).getTime();
        const end = this.systemConfig.getReservationEnd(this.reservation);
        return start < now && end > now;
    }

    getDate() {
        return DateUtil.toDate(this.reservation.date).toLocaleDateString();
    }

    duration(d: number) {
        return new Date(d).toLocaleTimeString();
    }

    onDurationChanged(duration: number) {
        this.reservation.duration = duration;
    }

    getTimes() {
        const times = [];
        for (let hour = this.systemConfig.openingHour; hour < this.systemConfig.closingHour; hour++) {
            for (let minute = 0; minute < 60; minute += this.systemConfig.durationUnitInMinutes) {
                times.push((hour * 60 + minute) * DateUtil.MINUTE);
            }
        }
        return times;
    }


    //    getDate( date: number ) {
    //        const d = new Date();
    //        d.setTime( date );
    //        return d;
    //    }


    onDelete() {
        this.clearError();
        this.service.deleteReservation(this.reservation.id)
            .subscribe(
                data => {
                    this.onBack();
                },
                err => {
                    this.httpError = err;
                },
                () => { this.onBack(); }
            );
    }

    onTerminate() {
        this.clearError();
        const now = new Date().getTime();
        while (this.systemConfig.getReservationEnd(this.reservation) > now) {
            this.reservation.duration--;
        }
        if (this.reservation.duration > 0) {
            this.service.updateReservation(this.reservation)
            .subscribe(
                data => {
                    this.onBack();
                },
                error => {
                    this.httpError = error;
                }
            );
        } else {
            this.service.deleteReservation(this.reservation.id)
            .subscribe(
                data => {
                    this.onBack();
                },
                error => {
                    this.httpError = error;
                }
            );
        }
    }

    onUpdate() {
        this.clearError();
        this.reservation.type = ReservationType[this.type];
        this.reservation.start = this.time;
        this.service.updateReservation(this.reservation)
            .subscribe(
                data => {
                    this.onBack();
                },
                err => {
                    this.httpError = err;
                },
                () => { this.onBack(); }
            );
    }

    onBack() {
        this.router.navigate(['/table', this.systemConfig.id, this.reservation.date]);
    }
}
