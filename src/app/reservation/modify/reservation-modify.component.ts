import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
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
        const systemId = this.route.snapshot.params.system;
        const reservationId: number = this.route.snapshot.params.reservation;
        this.showType = false;
        this.showRepeat = false;
        this.focus = 'date';

        // create option list of occupation types
        this.types = Object.keys(ReservationType).map(key => ReservationType[key])
            .filter(value => typeof value === 'string');

        this.service.getSystemConfig(systemId).subscribe(
            config => {
                this.systemConfig = ReservationSystemConfig.of(config);
                this.userService.getLoggedInUser().subscribe(
                    user => {
                        this.user = new User(user.id, user.name, UserRole['' + user.role]);
                        this.service.getReservation(reservationId).subscribe(
                            reservation => {
                                this.reservation = reservation;
                                this.time = this.reservation.start;
                                this.type = ReservationType[this.reservation.type];
                                this.update();
                            },
                            reservationerror => this.httpError = reservationerror
                        );
                    },
                    usererror => this.httpError = usererror
                );
            },
            configerror => this.httpError = configerror
        );
    }

    ngOnDestroy(): void {
        this.reservation = undefined;
        this.user = undefined;
        this.clearError();
    }

    private update() {

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
