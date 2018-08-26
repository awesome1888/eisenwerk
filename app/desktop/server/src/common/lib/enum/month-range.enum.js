import EnumFactory from '../util/enum-factory/index.js';
import moment from 'moment';

import monthEnum from './month.enum.js';

class MonthRangeEnumFactory extends EnumFactory {

    // NOT_SELECTED_KEY = 'NONE';
    NOT_SELECTED_VALUE = 'Startdatum'; // Momentan nicht auf der Suche
    MONTH_RANGE = 24; // two years

    constructor() {
        super([]);

        const range = [];
        let month = this.getCurrentUTCMonth();
        let year = this.getCurrentUTCYear();

        let prevMonth = month;
        let date = null;
        for (let i = 0; i < this.MONTH_RANGE; i++) {
            date = this.makeUTCDate(month, year);
            range.push({
                value: moment(date).locale('de').format('MMMM YYYY'),
                key: date.toUTCString(),
            });

            month += 1;
            month %= 12;
            if (month < prevMonth) {
                year += 1;
            }
            prevMonth = month;
        }
        // range.push({value: this.NOT_SELECTED_VALUE, key: this.NOT_SELECTED_KEY});

        this.setItems(range);
    }

    // getStartDate() {
    //     const month = this.getCurrentUTCMonth();
    //     const year = this.getCurrentUTCYear();
    //     return this.makeUTCDate(month, year);
    // }

    getCurrentUTCMonth() {
        return new Date().getUTCMonth();
    }

    getCurrentUTCYear() {
        return new Date().getUTCFullYear();
    }

    makeUTCDate(month, year) {
        return new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    }

    convertToStructureUTC(date, translateMonth = false) {
        const struct = {
            month: null,
            year: null,
        };
        if (_.isDate(date)) {
            struct.month = date.getUTCMonth();
            struct.year = date.getUTCFullYear();

            if (translateMonth) {
                struct.month = monthEnum.getKeyByIndex(struct.month, false);
            }
        }

        return struct;
    }

    convertFromStructureUTC(struct, translateMonth = false) {
        if (_.isObjectNotEmpty(struct) && _.isExist(struct.month) && _.isExist(struct.year)) {
            let month = struct.month;
            if (translateMonth) {
                month = monthEnum.getIndexByKey(month);
            }
            return this.makeUTCDate(month, struct.year);
        }

        return null;
    }

    makeCurrentUTCDate() {
        const month = this.getCurrentUTCMonth();
        const year = this.getCurrentUTCYear();

        return this.makeUTCDate(month, year);
    }

    // limitDate(date) {
    //     const start = this.makeCurrentUTCDate();
    //     if (date < start) {
    //         return start;
    //     }
    //
    //     return date;
    // }
    //
    // isBrokenDate(date) {
    //     if (!_.isDate(date)) {
    //         return false;
    //     }
    //
    //     const day = date.getUTCDate();
    //     const hour = date.getUTCHours();
    //
    //     return parseInt(day, 10) !== 1 || parseInt(hour, 10) !== 0;
    // }
}

export default new MonthRangeEnumFactory();
