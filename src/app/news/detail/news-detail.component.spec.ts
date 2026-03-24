import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { NewsDetailComponent } from './news-detail.component';

describe('NewsDetailComponent', () => {
	let component: NewsDetailComponent;
	let fixture: ComponentFixture<NewsDetailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NewsDetailComponent],
			providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
		})
			.compileComponents();
    
		fixture = TestBed.createComponent(NewsDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
