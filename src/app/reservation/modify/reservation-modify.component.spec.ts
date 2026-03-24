import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ReservationModifyComponent } from './reservation-modify.component';

describe('ReservationModifyComponent', () => {
	let component: ReservationModifyComponent;
	let fixture: ComponentFixture<ReservationModifyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReservationModifyComponent],
			providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
		}).compileComponents();
		fixture = TestBed.createComponent(ReservationModifyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
