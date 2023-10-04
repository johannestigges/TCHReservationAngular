import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReservationService } from '../reservation.service';
import { OccupationTable } from './occupation-table';
import { Occupation } from '../occupation';
import { UserService } from '../../admin/user/user.service';
import { User } from '../../admin/user/user';
import { UserRole, userRoleFrom } from '../../admin/user/user-role.enum';
import { activationStatusFrom } from '../../admin/user/activation-status.enum';
import { DateUtil } from '../../util/date/date-util';
import { ErrorAware } from '../../util/error/error-aware';
import { Observable, timer, Subscription } from 'rxjs';
import { ReservationSystemConfig } from '../reservation-system-config';

@Component({
	selector: 'tch-occupation-table',
	templateUrl: './occupation-table.component.html',
	styleUrls: ['./occupation-table.component.scss'],
})
export class OccupationTableComponent extends ErrorAware implements OnInit, OnDestroy {
	occupationTable = new OccupationTable(User.EMPTY);
	lastUpdated = 0;
	private timer?: Observable<number>;
	private timerSubscription?: Subscription;
	systemConfigs: ReservationSystemConfig[] = [];

	constructor(
		private reservationService: ReservationService,
		private userService: UserService,
		private route: ActivatedRoute,
		private router: Router
	) {
		super();
	}

	ngOnInit() {
		this.setTheme();
		this.route.paramMap.subscribe(params => {
			const date = params.get('date');
			if (date) {
				this.occupationTable.setDate(parseInt(date, 10));
			}
			this.reservationService.getAllSystemConfigs().subscribe(systemConfigs => {
				this.systemConfigs = systemConfigs;
				const systemConfigId = Number(params.get('system') ?? systemConfigs[0].id);
				const systemConfig = systemConfigs.find(e => e.id === systemConfigId) ?? this.systemConfigs[0];
				this.initTable(systemConfig);
			});
		});
	}

	private initTable(systemConfig: ReservationSystemConfig) {
		this.occupationTable.systemConfig = ReservationSystemConfig.of(systemConfig);

		// get logged in user
		this.userService.getLoggedInUser().subscribe({
			next: (user) => {
				this.occupationTable.user = new User(
					user.id,
					user.name,
					userRoleFrom(user.role),
					'',
					'',
					activationStatusFrom(user.status)
				);
				// update occupation table
				this.update(this.occupationTable.date);
			},
			error: (usererror) => this.setError(usererror)
		}).add(() => {
			// reload system when user is 'kiosk' every 5 Minutes
			if (this.occupationTable.user.hasRole(UserRole.KIOSK)) {
				this.timer = timer(300000, 300000);
				this.timerSubscription = this.timer.subscribe(() =>
					this.update(this.occupationTable.date)
				);
			}
		});
	}

	ngOnDestroy() {
		// unsubscribe refresh timer when in kiosk mode
		if (this.timerSubscription) {
			this.timerSubscription.unsubscribe();
		}
	}

	isLoggedIn() {
		return !this.occupationTable.user.hasRole(UserRole.ANONYMOUS);
	}

	canChangePassword() {
		return (
			this.isLoggedIn() &&
			!this.occupationTable.user.hasRole(UserRole.KIOSK, UserRole.TECHNICAL)
		);
	}

	canLogout() {
		return (
			this.isLoggedIn() && !this.occupationTable.user.hasRole(UserRole.KIOSK)
		);
	}

	isAdminOrTrainer() {
		return (
			this.isLoggedIn() &&
			this.occupationTable.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)
		);
	}

	canModify(occupation: Occupation): boolean {
		if (!this.isLoggedIn()) {
			return false;
		}

		// admin and trainer can modify everything
		if (this.occupationTable.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
			return true;
		}

		const now = new Date().getTime();
		const start = DateUtil.ofDateAndTime(
			occupation.date,
			occupation.start
		).getTime();
		const end = this.occupationTable.systemConfig.getOccupationEnd(occupation);

		// everyone can terminate current reservation
		if (start < now && end > now) {
			return true;
		}

		// cannot modify occupation in the past
		if (start < now) {
			return false;
		}

		// can only modify my ccupations
		return occupation.reservation.user.id === this.occupationTable.user.id;
	}

	canShowText(occupation: Occupation) {
		return (
			occupation.type !== 0 || this.isLoggedIn()
		);
	}

	canAdd(date: number): boolean {
		if (!this.isLoggedIn()) {
			return false;
		}

		// admin and trainer can add everything
		if (this.occupationTable.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
			return true;
		}

		// cannot add occupation in the past
		if (date < this.lastUpdated) {
			return false;
		}

		// teamster can add in the future
		if (this.occupationTable.user.hasRole(UserRole.TEAMSTER)) {
			return true;
		}

		// only for this and some days
		return (
			date - this.lastUpdated <
			this.occupationTable.systemConfig.maxDaysReservationInFuture *
			DateUtil.DAY
		);
	}

	/**
   * update table: read occupations asynchronously and show table
   */
	private update(date: number) {
		this.clearError();
		this.reservationService
			.getOccupations(this.occupationTable.systemConfig.id, date)
			.subscribe({
				next: (data) => {
					this.lastUpdated = new Date().getTime();
					this.occupationTable.setDate(date);
					this.show(data);
				},
				error: (error) => this.setError(error)
			});
	}

	showDate() {
		return DateUtil.toDate(this.occupationTable.date).toLocaleDateString(
			'de-DE',
			{ weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' }
		);
	}

	showDateShort() {
		return DateUtil.toDate(this.occupationTable.date).toLocaleDateString(
			'de-DE',
			{ weekday: 'short', month: '2-digit', day: '2-digit' }
		);
	}

	onLogin() {
		this.router.navigate(['/login']);
	}

	navigateTo(id: number) {
		this.router.navigate(['table', id, this.occupationTable.date]);
	}

	toggleTheme() {
		const theme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
		this.setTheme();
	}

	setTheme() {
		document.documentElement.setAttribute('data-bs-theme', localStorage.getItem('theme') ?? 'light');
	}

	private show(occupations: Occupation[]) {
		this.occupationTable.occupations = occupations;
		this.occupationTable.show();
	}

	onBackWeek() {
		this.update(this.occupationTable.date - 7 * DateUtil.DAY);
	}

	onBackDay() {
		this.update(this.occupationTable.date - DateUtil.DAY);
	}

	onToday() {
		this.update(new Date().getTime());
	}

	onNextDay() {
		this.update(this.occupationTable.date + DateUtil.DAY);
	}

	onNextWeek() {
		this.update(this.occupationTable.date + 7 * DateUtil.DAY);
	}
}
