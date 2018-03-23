import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DateUtil } from '../date/date-util';
import { Occupation } from './occupation';
import { OccupationType } from './occupationtype';
import { OccupationSystemConfig } from './occupation-system-config';

/**
 * occupation service
 */
@Injectable()
export class OccupationService {

  private occupations: Occupation[] = [];
  private systemConfig: { [key: number]: OccupationSystemConfig; } = {};

  constructor() {
    // initialize system config
    this.systemConfig[1] = new OccupationSystemConfig(1, 6, 30, 8, 22, 0, 4);
    this.systemConfig[2] = new OccupationSystemConfig(1, 2, 30, 8, 22, 0, 480);

    // initialize some occupations
    this.occupations.push(new Occupation(
      DateUtil.of(12), 2, OccupationType.Meisterschaft, 'Meisterschaft', 1, 1, 2));
    this.occupations.push(new Occupation(
      DateUtil.of(9), 3, OccupationType.Quickbuchung, 'Quickbuchung', 2, 1, 2));
    this.occupations.push(new Occupation(
      DateUtil.of(10, 30), 2, OccupationType.Training, 'Training', 2, 1));
    this.occupations.push(new Occupation(
      DateUtil.of(13), 3, OccupationType.Dauerbuchung, 'Dauerbuchung', 1, 2));

  }

  getOccupation(id: number): Observable<Occupation> {
    let found: Occupation = null;
    this.occupations.forEach(o => {
      if (o.id == id) {
        found = o;
      }
    });
    return of(found);
  }

  getOccupations(date: Date): Observable<Occupation[]> {
    return of(this.occupations.filter(o => DateUtil.isSameDay(o.start, date)));
  }

  addOccupation(occupation) {
    this.occupations.push(occupation);
  }

  delete(id: number) {
    this.occupations = this.occupations.filter(o => o.id !== id);
  }

  getSystemConfig(systemId) {
    return this.systemConfig[systemId];
  }
}