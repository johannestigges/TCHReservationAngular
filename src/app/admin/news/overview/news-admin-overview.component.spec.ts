import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsAdminOverviewComponent } from './news-admin-overview.component';

describe('NewsAdminOverviewComponent', () => {
	let component: NewsAdminOverviewComponent;
	let fixture: ComponentFixture<NewsAdminOverviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NewsAdminOverviewComponent]
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
