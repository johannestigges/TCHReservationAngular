import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { NewsModifyComponent } from './news-modify.component';

describe('NewsModifyComponent', () => {
	let component: NewsModifyComponent;
	let fixture: ComponentFixture<NewsModifyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NewsModifyComponent],
			providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
		})
			.compileComponents();
    
		fixture = TestBed.createComponent(NewsModifyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
