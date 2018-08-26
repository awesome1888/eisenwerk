import latinize from 'latinize';

export default class Helper {

    static getSearchCondition(search) {
        search = search.split(/\s+/).map(x => this._prepare(x)).filter(_.isStringNotEmpty);
        const cond = [];
        search.forEach((word) => {
            cond.push({search: {$regex: `^${word}`}});
        });
        return cond;
    }

    static _clean(search) {
        if (!_.isStringNotEmpty(search)) {
            return '';
        }
        search = search.replace(/\s+/, ' ');
        search = search.replace(/-/, ' ');
        // https://www.fileformat.info/info/charset/UTF-8/list.htm?
        return search.replace(/[^\u0020\u0030-\u0039\u0041-\u005A\u0061-\u007B\u00C0-\u02AF\u0370-\u052F]/g, '');
    }

    static _prepare(text) {
        return latinize(this._clean(text).trim().toLowerCase());
    }
}
