import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormGroupDirective } from '@angular/forms';

import { ReservationTypesComponent } from './reservation-types.component';

describe('ReservationTypesComponent', () => {
	let component: ReservationTypesComponent;
	let fixture: ComponentFixture<ReservationTypesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReservationTypesComponent],
			providers: [
				{ provide: FormGroupDirective, useValue: { control: new FormGroup({}) } }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(ReservationTypesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
