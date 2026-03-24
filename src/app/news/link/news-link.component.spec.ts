import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { NewsLinkComponent } from './news-link.component';

describe('NewsLinkComponent', () => {
	let component: NewsLinkComponent;
	let fixture: ComponentFixture<NewsLinkComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NewsLinkComponent],
			providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
		})
			.compileComponents();
    
		fixture = TestBed.createComponent(NewsLinkComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
