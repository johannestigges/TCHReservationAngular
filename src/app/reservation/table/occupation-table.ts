import { DateUtil } from '../../util/date/date-util';
import { TableData } from '../../util/table/table-data';

import { Occupation } from '../occupation';
import { AvailableEntry } from './available-entry';
import { User } from '../../admin/user/user';
import { UserRole } from '../../admin/user/user-role.enum';
import { ReservationSystemConfig } from '../reservation-system-config';

export class OccupationTable extends TableData {

    occupations: Occupation[] = [];
    systemConfig: ReservationSystemConfig;
    date: number; // display occupation table for one day in epoch millies

    constructor(public user: User) {
        super();
        this.setDate(new Date().getTime());
    }

    setDate(date: number) {
        this.date = DateUtil.getDatePart(date);
    }

    setUser(user: User) {
        this.user = user;
        this.show();
    }

    setSystemConfig(systemConfig: ReservationSystemConfig) {
        this.systemConfig = ReservationSystemConfig.of(systemConfig);
        this.createEmptyTable();
    }

    show(date: number = this.date) {
        this.setDate(date);
        this.createEmptyTable();
        for (const occupation of this.occupations) {
            this.addOccupation(occupation);
        }
    }

    private addOccupation(occupation: Occupation) {
        const row = this.systemConfig.toRow(occupation.start);
        const column = occupation.court;
        const rowspan = occupation.duration;
        const colspan = occupation.lastCourt - occupation.court + 1;
        this.setCell(row, column, rowspan, colspan);
        this.setData(row, column, occupation);
        // need to add available entry?
        const availableRow = row + rowspan;
        for (let c = column; c < column + colspan; c++) {
            if (availableRow < this.getRows() &&
                (!this.getCell(availableRow, c) ||
                    this.getCell(availableRow, c).rowspan === 0)) {
                this.createAvailableEntry(availableRow, c, 1);
            }
        }
    }

    createEmptyTable() {
        const rowspan = 60 / this.systemConfig.durationUnitInMinutes;
        this.clearAll();
        for (let row = 0; row < this.systemConfig.getRows(); row++) {

            // first column: time
            this.setCell(row, 0, 1);
            this.setData(row, 0, { time: this.showTime(row), short_time: this.showShortTime(row) });
            // courts
            for (let column = 0; column < this.systemConfig.courts.length; column++) {
                this.createAvailableEntry(row, column + 1, rowspan);
            }
        }
    }

    createAvailableEntry(row: number, column: number, rowspan: number) {
        const mainRow: boolean = row % rowspan === 0;
        if (this.canMakeReservation()) {
            this.setCell(row, column);
            this.setData(row, column,
                new AvailableEntry(this.date + this.systemConfig.toMinutes(row) * DateUtil.MINUTE,
                    column, mainRow ? 'available' : 'available_light'));
        } else {
            if (mainRow) {
                this.setCell(row, column, rowspan);
            }
        }
    }

    canMakeReservation() {
        if (!this.user || this.user.hasRole(UserRole.ANONYMOUS)) {
            return false;
        }
        if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
            return true;
        }
        if (this.user.hasRole(UserRole.KIOSK, UserRole.REGISTERED, UserRole.TECHNICAL)) {
            return true;
        }
        return false;
    }

    private showTime(row: number): string {
        const start = new Date();
        this.systemConfig.setTime(start, row);
        const end = DateUtil.toDate(start.getTime() + this.systemConfig.durationUnitInMinutes * DateUtil.MINUTE);

        return this.zeroPad(start.getHours(), 2) + ':' + this.zeroPad(start.getMinutes(), 2) + ' - ' +
            this.zeroPad(end.getHours(), 2) + ':' + this.zeroPad(end.getMinutes(), 2);
    }

    private showShortTime(row: number): string {
        const start = new Date();
        this.systemConfig.setTime(start, row);
        return '' + start.getHours();
    }

    private zeroPad(num, places) {
        const zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join('0') + num;
    }
}
