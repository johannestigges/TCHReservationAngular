import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationTypesComponent } from './reservation-types.component';

describe('ReservationTypesComponent', () => {
	let component: ReservationTypesComponent;
	let fixture: ComponentFixture<ReservationTypesComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ReservationTypesComponent]
		});
		fixture = TestBed.createComponent(ReservationTypesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
