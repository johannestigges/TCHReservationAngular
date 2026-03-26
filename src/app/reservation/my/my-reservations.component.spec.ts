import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { MyReservationsComponent } from './my-reservations.component';

describe('MyComponent', () => {
  let component: MyReservationsComponent;
  let fixture: ComponentFixture<MyReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyReservationsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
