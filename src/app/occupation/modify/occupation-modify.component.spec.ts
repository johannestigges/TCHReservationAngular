import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupationModifyComponent } from './occupation-modify.component';

describe('OccupationModifyComponent', () => {
  let component: OccupationModifyComponent;
  let fixture: ComponentFixture<OccupationModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupationModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupationModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
