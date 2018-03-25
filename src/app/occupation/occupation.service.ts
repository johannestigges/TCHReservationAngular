import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(private httpClient: HttpClient) {
    // initialize system config
    this.systemConfig[1] = new OccupationSystemConfig(1, 6, 30, 8, 22, 0, 4);
    this.systemConfig[2] = new OccupationSystemConfig(1, 2, 30, 8, 22, 0, 480);

    // initialize some occupations
//    this.occupations.push(new Occupation(
//      DateUtil.of(12), 2, OccupationType.Meisterschaft, 'Meisterschaft', 1, 1, 2));
//    this.occupations.push(new Occupation(
//      DateUtil.of(9), 3, OccupationType.Quickbuchung, 'Quickbuchung', 2, 1, 2));
//    this.occupations.push(new Occupation(
//      DateUtil.of(10, 30), 2, OccupationType.Training, 'Training', 2, 1));
//    this.occupations.push(new Occupation(
//      DateUtil.of(13), 3, OccupationType.Dauerbuchung, 'Dauerbuchung', 1, 2));

  }

  getOccupation(id: number): Observable<Occupation> {
//    httpClient.get('http://127.0.0.1:8080/getOccupations/')

    let found: Occupation = null;
    this.occupations.forEach(o => {
      if (o.id == id) {
        found = o;
      }
    });
    return of(found);
  }

  getOccupations(date: Date): Observable<Occupation[]> {
    this.httpClient.get<Occupation[]>('http://127.0.0.1:8080/getOccupations').subscribe(o=> this.occupations = o);
    return of(this.occupations.filter(o => DateUtil.isSameDay(o.start, date)));
  }

  addOccupation(occupation) {
    console.log('add ');
    console.log(occupation);
    this.httpClient.post<Occupation>('http://127.0.0.1/add', occupation)
//    this.occupations.push(occupation);
  }

  delete(id: number) {
    console.log('delete ' + id)
    this.httpClient.delete('http://127.0.0.1/delete/' + id);
    //this.occupations = this.occupations.filter(o => o.id !== id);
  }

  getSystemConfig(systemId) {
    return this.systemConfig[systemId];
  }
}
