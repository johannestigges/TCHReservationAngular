/**
 * reservation date
 */
export class RDate {

    /**
     * 
     * @param start start of reservation
     * @param interval interval in minutes
     */
    constructor( public start: Date, public interval: number ) { }

    static MINUTE = 1000 * 60;
    static HOUR = RDate.MINUTE * 60;
    static DAY = RDate.HOUR * 24;

    /**
     * create a date object
     * 
     * @param hour hour of day
     * @param minute minute default = 0
     * @param day day relative to today, default = 0
     */
    static of( hour: number, minute: number = 0, day: number = 0 ): Date {
        const d = new Date();
        d.setHours( hour, minute, 0, 0 );
        if ( day !== 0 ) {
            d.setTime( d.getTime() + day * RDate.DAY );
        }
        return d;
    }

    rows( start: Date, end: Date ): number {
        return ( end.getTime() - start.getTime() ) / this.interval;
    }

    row( date: Date ): number {
        return this.rows( this.start, date );
    }

    date( row: number ): Date {
        return new Date( this.start.getTime() + row * this.interval );
    }

    isSameDay( d1: Date, d2: Date = this.start ) {
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    }
}
