import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { QrComponent } from './qr.component';

describe('QrComponent', () => {
	let component: QrComponent;
	let fixture: ComponentFixture<QrComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [QrComponent],
			providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
		}).compileComponents();
		fixture = TestBed.createComponent(QrComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
