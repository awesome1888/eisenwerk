import Util from '../../../../lib/util/index.js';
import Mapping from '../../entity/server.js';
import mappingTypeEnum from '../../enum/mapping-type.js';

export default class UserProcessor {

    async process(id, data, prevData) {
        const cp = data || {};
        const cpPrev = prevData || {};

        const delta = this.makeDeltas(cp, cpPrev);
        const model = Mapping.getModel();

        const toRemove = [];
        const toUpsert = [];

        _.forEach(delta, (section, type) => {

            _.forEach(section.delete, (item, value) => {
                toRemove.push({
                    type,
                    value,
                    candidateId: id,
                });
            });

            _.forEach(section.upsert, (item, value) => {
                toUpsert.push({
                    filter: {
                        type,
                        value,
                        candidateId: id,
                    },
                    data: {
                        type,
                        value,
                        candidateId: id,
                        extraInfo: {},
                        createdAt: new Date(),
                    },
                });
            });
        });

        await Promise.all(toRemove.map((item) => {
            return model.deleteOne(item);
        }));

        await Promise.all(toUpsert.map((item) => {
            return model.findOneAndUpdate(item.filter, item.data, {upsert: true});
        }));
    }

    makeDeltas(cp, cpPrev) {
        const delta = {};

        // skills
        this.makeDeltaOne(delta, cp, cpPrev, 'data.skills', 'skill', mappingTypeEnum.SKILL);

        // personal information, location
        this.makeDeltaLocation(delta, cp, cpPrev);

        return delta;
    }

    makeDeltaLocation(delta, cp, cpPrev) {
        delta.location = delta.location || {upsert: {}, delete: {}};

        if (!_.isObjectNotEmpty(cp.profile) || !('residence' in cp.profile)) {
            // we do not update this field right now
            return;
        }

        const locBefore = (_.getValue(cpPrev, 'profile.residence') || '').toString();
        const locAfter = (_.getValue(cp, 'profile.residence') || '').toString();

        // check if something changed
        if (locBefore !== locAfter) {
            // NOT ID to something else -> remove
            if (_.isStringNotEmpty(locBefore) && !Util.isId(locBefore)) {
                delta.location.delete[locBefore.trim()] = 1;
            }

            // something to NOT ID -> upsert
            if (_.isStringNotEmpty(locAfter) && !Util.isId(locAfter)) {
                delta.location.upsert[locAfter.trim()] = 1;
            }
        }
    }

    makeDeltaOne(delta, cp, cpPrev, section, key, type) {
        delta[type] = delta[type] || {upsert: {}, delete: {}};

        if (_.isUndefined(_.getValue(cp, section))) {
            // we do not update this field right now
            return;
        }

        const pairs = this.makePairs(cp, cpPrev, section);

        if (_.isObjectNotEmpty(pairs)) {
            _.forEach(pairs, (item) => {
                const uFrom = (item.from[key] || '').toString();
                const uTo = (item.to[key] || '').toString();

                if (uFrom !== uTo) {
                    if (_.isStringNotEmpty(uTo) && !Util.isId(uTo)) {
                        delta[type].upsert[uTo.trim()] = item.to;
                    }
                    if (_.isStringNotEmpty(uFrom) && !Util.isId(uFrom)) {
                        delta[type].delete[uFrom.trim()] = 1;
                    }
                }
            });
        }
    }

    makePairs(cp, cpPrev, path) {
        const high = _.getValue(cp, path) || [];
        const highPrev = _.getValue(cpPrev, path) || [];

        const pairs = {};
        highPrev.forEach((item) => {

            const id = item._id || _.random(10000, 99999);

            pairs[id] = pairs[id] || {};
            pairs[id].from = item;
            pairs[id].to = pairs[id].to || {};
        });
        high.forEach((item) => {

            const id = item._id || _.random(10000, 99999);

            pairs[id] = pairs[id] || {};
            pairs[id].from = pairs[id].from || {};
            pairs[id].to = item;
        });

        return pairs;
    }
}
