import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { ReservationType, reservationTypeFrom, reservationTypeValues } from '../reservationtype';
import { ReservationService } from '../reservation.service';
import { ReservationSystemConfig } from '../reservation-system-config';
import { Reservation } from '../reservation';
import { ErrorAware } from '../../util/error/error-aware';

import { UserService } from '../../admin/user/user.service';
import { User } from '../../admin/user/user';
import { UserRole, userRoleFrom } from '../../admin/user/user-role.enum';
import { DateUtil } from '../../util/date/date-util';
import { activationStatusFrom } from '../../admin/user/activation-status.enum';

@Component({
	selector: 'tch-reservation-add',
	templateUrl: './reservation-add.component.html',
	styleUrls: ['./reservation-add.component.scss'],
})
export class ReservationAddComponent extends ErrorAware implements OnInit {
	systemConfig = ReservationSystemConfig.EMPTY;
	user = User.EMPTY;
	reservation = Reservation.EMPTY;

	repeatUntil?: NgbDateStruct;
	repeatMinDate?: Date;
	time?: number;
	type?: string;
	player1 = '';
	player2 = '';
	player3 = '';
	player4 = '';

	types = reservationTypeValues;

	showType = false;
	showText = true;
	showSimpleDuration = false;
	showDuration = false;
	showRepeat = false;
	showDouble = false;
	focus = 'date';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private service: ReservationService,
		private userService: UserService
	) {
		super();
	}

	ngOnInit() {
		const systemId = this.route.snapshot.params.system;
		const start = parseInt(this.route.snapshot.params.date, 10);
		const court = this.route.snapshot.params.court;

		this.repeatMinDate = DateUtil.addDays(new Date(), 1);

		this.reservation.date = DateUtil.getDatePart(start);
		this.reservation.start = DateUtil.getTimePart(start);
		this.reservation.duration = 1;
		this.reservation.type = ReservationType.Quickbuchung;
		this.reservation.courts = court;

		this.service.getSystemConfig(systemId).subscribe({
			next: (config) => {
				this.systemConfig = ReservationSystemConfig.of(config);
				this.reservation.systemConfigId = this.systemConfig.id;
				this.userService.getLoggedInUser().subscribe({
					next: (user) => {
						this.user = new User(
							user.id,
							user.name,
							userRoleFrom(user.role),
							'',
							'',
							activationStatusFrom(user.status)
						);
						this.reservation.user = user;
						this.init();
					},
					error: (usererror) => this.setError(usererror)
				});
			},
			error: (configerror) => this.setError(configerror)
		});
	}

	onGenerateOccupations() {
		if (!this.repeatUntil || !this.time || !this.reservation || !this.type) {
			return;
		}
		this.clearError();
		this.reservation.occupations = [];
		this.reservation.type = reservationTypeFrom(this.type);
		this.reservation.start = this.time;
		this.reservation.repeatUntil = DateUtil.convertFromNgbDateStruct(this.repeatUntil).getTime();
		if (!this.showText) {
			if (this.showDouble) {
				this.reservation.text = `${this.player1} ${this.player2} ${this.player3} ${this.player4}`;
			} else {
				this.reservation.text = `${this.player1} ${this.player2}`;
			}
		}
		this.service.checkReservation(this.reservation).subscribe({
			next: (reservation) => this.reservation = reservation,
			error: (error) => (this.httpError = error)
		});
	}

	onDeleteOccupation(i: number) {
		this.reservation?.occupations.splice(i, 1);
	}

	private init() {
		if (!this.reservation || !this.systemConfig) {
			return;
		}
		// decide which parts of the layout are visible
		// this depends on the user role
		this.showType = this._isAtLeastTeamster();
		this.showSimpleDuration = this.systemConfig?.durationUnitInMinutes === 30 && !this._isAtLeastTeamster();
		this.showDuration = !this.showSimpleDuration && this._isAtLeastTeamster();
		this.showRepeat = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
		if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
			this.focus = 'date';
		}
		if (this.user.hasRole(UserRole.TRAINER, UserRole.TEAMSTER)) {
			this.focus = 'duration';
		}
		if (this.user.hasRole(UserRole.REGISTERED)) {
			this.focus = 'duration';
		}
		if (this.user.hasRole(UserRole.KIOSK, UserRole.TECHNICAL)) {
			this.focus = 'text';
		}

		if (this.showText) {
			this.reservation.text = this._getCookie('text');
		} else {
			this.player1 = this._getCookie('player1');
			this.player2 = this._getCookie('player2');
			this.player3 = this._getCookie('player3');
			this.player4 = this._getCookie('player4');
		}
		if (this.user.hasRole(UserRole.TRAINER)) {
			this.reservation.type = ReservationType.Training;
			this.reservation.text = this.user.name;
		}
		if (this.user.hasRole(UserRole.TEAMSTER)) {
			this.reservation.type = ReservationType.Meisterschaft;
			this.reservation.text = this._getCookie('myTeam');
		}
		this.time = this.reservation.start;
		this.reservation.duration = this.systemConfig.getDurationDefault();
		this.type = ReservationType[this.reservation.type];
	}

	getDate() {
		return this.toDate(this.reservation!.date);
	}

	toDate(date: number) {
		return DateUtil.toDate(date).toLocaleDateString();
	}

	duration(d: number) {
		return new Date(d).toLocaleTimeString();
	}

	onRepeatTypeChanged() {
		this.reservation!.occupations = [];
	}

	onDurationChanged(duration: number) {
		this.reservation!.duration = duration;
		this.showDouble = duration === 3;
	}

	getTimes() {
		const times = [];
		for (
			let hour = this.systemConfig!.openingHour;
			hour < this.systemConfig!.closingHour;
			hour++
		) {
			for (
				let minute = 0;
				minute < 60;
				minute += this.systemConfig!.durationUnitInMinutes
			) {
				times.push((hour * 60 + minute) * DateUtil.MINUTE);
			}
		}
		return times;
	}

	onClick() {
		this.clearError();
		this.reservation!.type = reservationTypeFrom(this.type);
		this.reservation!.start = this.time!;
		if (this.repeatUntil) {
			this.reservation!.repeatUntil = DateUtil.convertFromNgbDateStruct(this.repeatUntil).getTime();
		}
		if (!this.showText) {
			this._setCookie('player1', this.player1);
			this._setCookie('player2', this.player2);
			if (this.showDouble) {
				this.reservation!.text = `${this.player1} ${this.player2} ${this.player3} ${this.player4}`;
				this._setCookie('player3', this.player3);
				this._setCookie('playerr4', this.player4);
			} else {
				this.reservation!.text = `${this.player1} ${this.player2}`;
			}
		} else {
			this._setCookie('text', this.reservation!.text);
		}
		this.service.addReservation(this.reservation!).subscribe({
			next: (data) => {
				this.reservation = data;
				if (this.reservation.occupations.length > 1) {
					let msg = `Es wurden ${this.reservation.occupations.length} Platzbelegungen angelegt.`;
					for (const o of this.reservation.occupations) {
						msg += `\n${DateUtil.showDate(o.date)} ${DateUtil.showTime(o.start)}`;
					}
					alert(msg);
				}
				this.onBack();
			},
			error: (error) => (this.httpError = error)
		});
	}

	onBack() {
		this.router.navigate(['/table', this.systemConfig!.id, this.reservation!.date]);
	}

	private _getCookie(name: string) {
		return localStorage.getItem(name) ?? '';
	}

	private _setCookie(name: string, value: string) {
		localStorage.setItem(name, value);
	}

	private _isAtLeastTeamster() {
		return this.user.hasRole(
			UserRole.ADMIN,
			UserRole.TRAINER,
			UserRole.TEAMSTER
		);
	}
}
