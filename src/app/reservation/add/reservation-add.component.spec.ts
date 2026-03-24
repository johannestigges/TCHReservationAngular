import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ReservationAddComponent } from './reservation-add.component';

describe('ReservationAddComponent', () => {
	let component: ReservationAddComponent;
	let fixture: ComponentFixture<ReservationAddComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReservationAddComponent],
			providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
		}).compileComponents();
		fixture = TestBed.createComponent(ReservationAddComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
