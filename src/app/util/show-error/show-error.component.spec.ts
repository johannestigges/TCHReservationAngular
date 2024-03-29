import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShowErrorComponent } from './show-error.component';

describe('ShowErrorComponent', () => {
	let component: ShowErrorComponent;
	let fixture: ComponentFixture<ShowErrorComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ ShowErrorComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ShowErrorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
