import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsLinkComponent } from './news-link.component';

describe('NewsLinkComponent', () => {
	let component: NewsLinkComponent;
	let fixture: ComponentFixture<NewsLinkComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NewsLinkComponent]
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
