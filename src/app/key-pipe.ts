/**
 * pipe to handle enums in select lists
 *
 * see https://stackoverflow.com/questions/35750059/select-based-on-enum-in-angular2
 */

/*
import { Pipe, PipeTramsform } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (var enumMember in value) {
      if (!isNaN(parseInt(enumMember, 10))) {
        keys.push({key: enumMember, value: value[enumMember]});
        // Uncomment if you want log
        // console.log("enum member: ", value[enumMember]);
      }
    }
    return keys;
  }
}
*/
