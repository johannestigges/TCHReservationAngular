import { DateUtil } from '../../date/date-util';
import { TableData } from '../../table/table-data';

import { Occupation } from '../occupation';
import { ReservationType } from '../reservationtype';
import { AvailableEntry } from './available-entry';
import { User } from '../../user/user';
import { UserRole } from '../../user/user-role.enum';
import { ReservationSystemConfig } from '../reservation-system-config';

export class OccupationTable extends TableData {

    occupations: Occupation[] = [];
    date: number; // display occupation table for one day in epoch millies

    constructor( public user: User, public systemConfig: ReservationSystemConfig ) {
        super();
        this.setDate( new Date().getTime() );
        this.createEmptyTable();
    }

    setDate( date: number ) {
        this.date = DateUtil.getDatePart( date );
    }

    setUser( user ) {
        this.user = user;
        this.show();
    }

    show( date: number = this.date ) {
        this.setDate( date );
        this.createEmptyTable();
        for ( const occupation of this.occupations ) {
            this.addOccupation( occupation );
        }
    }

    private addOccupation( occupation: Occupation ) {
        const row = this.systemConfig.toRow( occupation.start );
        const column = occupation.court;
        const rowspan = occupation.duration;
        const colspan = occupation.lastCourt - occupation.court + 1;
        //    console.log('add occupation (' + row + ',' + column + ') span (' + rowspan + ',' + colspan + ')');
        this.setCell( row, column, rowspan, colspan );
        this.setData( row, column, occupation );
    }

    createEmptyTable( rowspan = 2 ) {
        this.clearAll();
        for ( let row = 0; row < this.systemConfig.getRows(); row++ ) {
            let mainRow: boolean = row % rowspan == 0;

            // first column: time
            this.setCell( row, 0, 1 );
            this.setData( row, 0, { 'time': this.showTime( row ), 'short_time': this.showShortTime( row ) } );
            // court
            for ( let column = 0; column < this.systemConfig.courts; column++ ) {
                if ( this.canMakeReservation( row ) ) {
                    this.setCell( row, column + 1 );
                    this.setData( row, column + 1,
                        new AvailableEntry( this.date + this.systemConfig.toMinutes( row ) * DateUtil.MINUTE, column + 1, mainRow ? 'available' : 'available_light' ) );
                } else {
                    if ( mainRow ) {
                        this.setCell( row, column + 1, rowspan );
                    }
                }
            }
        }
    }

    canMakeReservation( row ) {
        if ( !this.user || this.user.hasRole( UserRole.ANONYMOUS ) ) {
            return false;
        }
        if ( this.user.hasRole( UserRole.ADMIN, UserRole.TRAINER ) ) {
            return true;

        }
        if ( this.user.hasRole( UserRole.KIOSK, UserRole.REGISTERED ) ) {
            return true;
        }
        return false;
    }

    private showTime( row: number ): string {
        const start = new Date();
        this.systemConfig.setTime( start, row );
        const end = DateUtil.toDate( start.getTime() + this.systemConfig.durationUnitInMinutes * DateUtil.MINUTE );

        return this.zeroPad( start.getHours(), 2 ) + ':' + this.zeroPad( start.getMinutes(), 2 ) + ' - ' +
            this.zeroPad( end.getHours(), 2 ) + ':' + this.zeroPad( end.getMinutes(), 2 );
    }
    
    private showShortTime( row: number): string {
        const start = new Date();
        this.systemConfig.setTime( start, row );
        return "" + start.getHours();
    }

    private zeroPad( num, places ) {
        var zero = places - num.toString().length + 1;
        return Array( +( zero > 0 && zero ) ).join( "0" ) + num;
    }
}
