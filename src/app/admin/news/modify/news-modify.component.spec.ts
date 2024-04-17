import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsModifyComponent } from './news-modify.component';

describe('NewsModifyComponent', () => {
	let component: NewsModifyComponent;
	let fixture: ComponentFixture<NewsModifyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NewsModifyComponent]
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
