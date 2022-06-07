import { TestBed } from '@angular/core/testing';
import { ApplicationPropertiesService } from './application-properties.service';

describe('ApplicationPropertiesService', () => {
  let service: ApplicationPropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationPropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
