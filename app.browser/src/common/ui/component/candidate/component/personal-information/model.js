export default class Model {
    static makeSubModel(data) {
        if (data) {
            return {
                dateOfBirth: data.getBirthDate(),
                residence: data.getResidence(),
                phone: data.getPhoneNumber(),
                uploadedFileUrl: data.getAvatarUrl(),
            };
        }
        return {};
    }

    static applySubModelToSource(model, target) {
        if (!_.isObject(target)) {
            return;
        }

        target.setBirthDate(model.dateOfBirth);
        target.setResidence(model.residence);
        target.setPhoneNumber(model.phone);
        target.setAvatar(model.uploadedFileUrl);
    }
}
