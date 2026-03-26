import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { NewsAdminOverviewComponent } from './news-admin-overview.component';

describe('NewsAdminOverviewComponent', () => {
	let component: NewsAdminOverviewComponent;
	let fixture: ComponentFixture<NewsAdminOverviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NewsAdminOverviewComponent],
			providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
		})
			.compileComponents();
    
		fixture = TestBed.createComponent(NewsAdminOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
