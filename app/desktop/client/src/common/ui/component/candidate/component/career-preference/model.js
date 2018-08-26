import BaseModel from '../../../sub-form/model-sub-item.js';
import workRemoteEnum from '../../../../../entity/user/enum/candidate.work-remote.enum.js';

export default class Model extends BaseModel {
    static extractItems(data) {
        return data.extractCareerPreference();
    }

    static putItems(data, items) {
        return data.putCareerPreference(items);
    }

    static makeSubModel(data) {
        let model = {};
        if (data) {
            model = _.deepClone(this.extractItems(data));
        }

        // prevening a super-weird "[undefined]" bug =/
        model.type = _.isArray(model.type) ? model.type : [];
        model.permanent = _.isObject(model.permanent) ? model.permanent : {};
        model.freelancer = _.isObject(model.freelancer) ? model.freelancer : {};

        this.updateSubModel(model);
        return model;
    }

    static applySubModelToSource(model, target) {

        if (!_.isObject(target)) {
            return;
        }

        if (_.getValue(model, 'permanent.workRemote') === workRemoteEnum.enums.RO) {
            model.permanent.preferredLocation = [];
            model.permanent.otherLocation = [];
        }

        if (_.getValue(model, 'freelancer.workRemote') === workRemoteEnum.enums.RO) {
            model.freelancer.preferredLocation = [];
            model.freelancer.otherLocation = [];
        }

        this.putItems(target, model);
    }
}
