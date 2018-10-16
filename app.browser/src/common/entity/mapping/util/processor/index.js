import User from './../../../user/entity/server.js';
import Mapping from './../../../mapping/entity/server.js';

import roleEnum from '../../../../lib/enum/role.js';

export default class Processor {

    async genericMap({from, to, collection, path, key, mapInternal}) {
        const candidate = await this._checkGeneric(from, to, path);

        if (!candidate) {
            // no suitable candidate to map, simply remove the mapping and exit
            await Mapping.remove(from._id);
            return;
        }

        // check if there is new item
        const item = await collection.findOne({_id: to._id});
        if (!item) {
            throw new Error('This item doesn\'t exit.');
        }

        await this._updateGeneric(
            from,
            to,
            candidate,
            path,
            key,
            mapInternal
        );
    }

    async genericUnMap({collection, id, type, path, key, preCheck = null, fields = null, fieldName = 'name', mapInternal = null}) {
        fields = fields || {[fieldName]: 1};

        const item = await collection.findOne({_id: id}, {fields});
        if (!item) {
            throw new Error('Item not found');
        }

        if (_.isFunction(preCheck)) {
            preCheck(id);
        }

        let full = path;
        if (_.isStringNotEmpty(key)) {
            full = `${path}.${key}`;
        }

        l(item);
        console.dir(full);

        // find candidates with this item
        const candidates = await User.find({
            filter: {
                role: {$in: [roleEnum.CANDIDATE]},
                $and: [
                    {[path]: {$exists: true, $ne: []}},
                    {[full]: id},
                ],
            },
            select: {
                [path]: 1,
            },
        }).fetch();

        l(candidates);

        return;

        await Promise.all(candidates.map((candidate) => {
            return this._updateCandidate(candidate, path, mapInternal, key, item[fieldName], id).then(() => {

                // upsert back the mapping items
                return Mapping.findOneAndUpdate({
                    type,
                    value: item[fieldName],
                    candidateId: candidate._id,
                }, {
                    type,
                    value: item.name,
                    candidateId: candidate._id,
                    createdAt: new Date(),
                }, {upsert: true});
            });
        }));

        // remove the item
        // tmp // await collection.remove(id);
    }

    async _checkGeneric(from, to, path) {
        const mapping = await Mapping.get(from._id, {lean: true});
        if (!mapping) {
            throw new Error('This mapping does\'t exist anymore.');
        }

        // check if there is user with mappingId
        return User.findOne({
            filter: {
                role: {$in: [roleEnum.CANDIDATE]},
                _id: from.candidateId,
                [path]: {$exists: true, $ne: []},
            },
            select: {
                [path]: 1,
            },
        });
    }

    async _updateCandidate(candidate, path, mapInternal, key, newValue, oldValue) {

        let d = _.getValue(candidate.getData(), path);
        if (_.isArray(d)) {
            d = d.map((rec) => {
                if (!_.isFunction(mapInternal)) {
                    if (rec[key] === oldValue) {
                        rec[key] = newValue;
                    }
                } else {
                    rec = mapInternal(rec, newValue);
                }
                return rec;
            });
        } else {
            d = newValue;
        }

        // update the candidate
        return User.save(candidate.getId(), {
            [path]: d,
        });
    }

    async _updateGeneric(from, to, candidate, path, key, mapInternal) {
        const result = await this._updateCandidate(candidate, path, mapInternal, key, to._id, from.label);
        if (result.isOk()) {
            await Mapping.remove(from._id);
        }
    }
}
