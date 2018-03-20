import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupationAddComponent } from './occupation-add.component';

describe('OccupationAddComponent', () => {
  let component: OccupationAddComponent;
  let fixture: ComponentFixture<OccupationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
