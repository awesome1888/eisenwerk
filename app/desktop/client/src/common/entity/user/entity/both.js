import languageEnum from '../../../lib/enum/language.enum.js';
import languageLevelEnum from '../../../lib/enum/language-level.enum.js';
import roleEnum from '../../../lib/enum/role.js';
import workExperienceEnum from '../../../entity/user/enum/candidate.work-experience.enum.js';
import preferredRoleEnum from '../../../entity/user/enum/candidate.preferred-role.enum.js';
import locationEnum from '../../../entity/location/enum/location.enum.js';
import skillEnum from '../../../entity/skill/enum/skill.enum.js';
import skillLevelEnum from '../../../entity/skill/enum/skill-level.enum.js';
import documentTypeEnum from '../../../lib/enum/document-type.enum.js';
import Util from '../../../lib/util/index.js';
import FileStackUtil from '../../../lib/util/filestack-image/filestack-image.js';
import moment from 'moment';

const M = superclass => class User extends superclass {
    static getUId() {
        return 'users';
    }

    getFirstName() {
        return this.getProfile().firstName || '';
    }

    getLastName() {
        return this.getProfile().lastName || '';
    }

    getFullName() {
        return `${this.getFirstName()} ${this.getLastName()}`.trim();
    }

    getEmail() {
        return this.getProfile().email || '';
    }

    getGender() {
        return this.getProfile().gender || '';
    }

    getAvatarUrl() {
        return (this.getProfile().uploadedFileUrl && FileStackUtil.getUrlResized(this.getProfile().uploadedFileUrl)) || '';
    }

    getAvatar() {
        return this.getProfile().uploadedFileUrl || '';
    }

    setAvatar(url) {
        this.getProfile().uploadedFileUrl = url;
    }

    hasAvatar() {
        return this.getAvatarUrl() && this.getAvatarUrl().length > 0;
    }

    getRole() {
        return this.getData().role;
    }

    hasRole(role) {
        return _.contains(this.getRole(), role);
    }

    isAdministrator() {
        return this.hasRole(roleEnum.ADMINISTRATOR);
    }

    getPhoneNumber() {
        return this.getProfile().phoneNumber || '';
    }

    setPhoneNumber(phoneNumber) {
        this.getProfile().phoneNumber = phoneNumber;
    }

    getLanguage() {
        return this.getProfile().language;
    }

    getProfile() {
        return this.getData().profile;
    }

    getCandidateProfile() {
        this.getData().data = this.getData().data || {};
        return this.getData().data;
    }

    getCandidatePersonalInformation() {
        return this.getCandidateProfile().personalInformation || {};
    }

    getBirthDate() {
        let date = this.getProfile().dateOfBirth;

        if (_.isStringNotEmpty(date)) {
            date = new Date(date);
        }
        return date || null;
    }

    setBirthDate(date) {
        date = _.isDate(date) ? date : null;

        this.getProfile().dateOfBirth = date;
    }

    hasBirthDate() {
        return this.getBirthDate() !== null;
    }

    getAge() {
        const bd = this.getBirthDate();
        if (_.isDate(bd)) {
            const age = Util.getAge(bd);
            if (age > 0) {
                return age;
            }
        }

        return 0;
    }

    getResidence() {
        return this.getProfile().residence || '';
    }

    setResidence(residence) {
        this.getProfile().residence = residence;
    }

    getEducation() {
        return this.getCandidateProfile().education || [];
    }

    hasResidence() {
        return this.getResidence().length > 0;
    }

    getResidenceDisplay() {
        const r = this.getResidence();
        return locationEnum.getByKey(r) || {};
    }

    extractEducation() {
        return this.getEducation();
    }

    putEducation(items) {
        this.getCandidateProfile().education = _.deepClone(items);
    }

    hasEducation() {
        return _.isArrayNotEmpty(this.getEducation());
    }

    getWorkExperience() {
        const items = this.getCandidateProfile().workExperience || [];

        if (_.isArrayNotEmpty(items)) {
            _.each(items, (item) => {
                if (_.isStringNotEmpty(item.start)) {
                    item.start = new Date(item.start);
                }
                if (_.isStringNotEmpty(item.end)) {
                    item.end = new Date(item.end);
                }
            });
        }

        return _.sortBy(items, 'start').reverse();
    }

    extractWorkExperience() {
        return this.getWorkExperience();
    }

    putWorkExperience(items) {
        this.getCandidateProfile().workExperience = items;
    }

    getWorkExperienceDisplay(props) {
        props = props || {};
        const format = props.dateFormat || 'MM.YYYY';

        return this.getWorkExperience().map((item) => {
            item = _.clone(item);

            if (_.isDate(item.start)) {
                item.start = moment(item.start).utc().format(format);
            }
            if (_.isDate(item.end)) {
                item.end = moment(item.end).utc().format(format);
            }

            return item;
        });
    }

    getDocuments() {
        const documents = this.getCandidateProfile().document || [];

        if (_.isArrayNotEmpty(documents)) {
            _.map(documents, (doc) => {
                if (_.isStringNotEmpty(doc.createdAt)) {
                    doc.createdAt = new Date(doc.createdAt);
                }
            });
        }
        return _.sortBy(_.deepClone(this.putIds(documents)), 'createdAt').reverse();
    }

    extractDocuments() {
        return this.getDocuments();
    }

    putDocuments(items) {
        this.getCandidateProfile().document = _.deepClone(items);
    }

    getDocumentDisplay(props) {
        props = props || {};
        const format = props.dateFormat || 'MMMM YYYY';

        return this.extractDocuments().map((item) => {
            item.createdAt = _.isDate(item.createdAt) ? moment(item.createdAt).format(format) : '';
            item.type = documentTypeEnum.getValueByKey(item.type);

            return item;
        });
    }

    getCareerPreferences() {
        return this.getCandidateProfile().careerPreference || {};
    }

    extractCareerPreference() {
        return this.getCandidateProfile().careerPreference || {};
    }

    putCareerPreference(items) {
        this.getCandidateProfile().careerPreference = _.deepClone(items);
    }

    /*
    * @param data - careerPreference.permanent or careerPreference.freelance
    * @return array of location values
    * */
    getCareerPreferenceLocationsDisplay(data) {
        let plValues = [];

        if (_.isArrayNotEmpty(data.preferredLocation)) {
            plValues = locationEnum.valuesFromKeys(data.preferredLocation);

            if (_.isArrayNotEmpty(data.otherLocation)) {

                _.each(data.otherLocation, (item) => {
                    if (!Util.isId(item)) {
                        plValues.push(item);
                    }
                });

                plValues = plValues.concat(locationEnum.valuesFromKeys(data.otherLocation));
            }

            plValues = plValues.filter(n => n); // remove null values
            plValues = _.uniq(plValues);
        }

        return plValues;
    }

    getSkills() {
        return this.getCandidateProfile().skills;
    }

    extractSkills() {
        return _.deepClone(this.getSkills()) || [];
    }

    putSkills(items) {
        this.getCandidateProfile().skills = _.deepClone(items);
    }

    getSkillsDisplaySorted() {
        return _.sortBy(_.sortBy(this.extractSkills().map((item) => {
            if (!Util.isId(item.skill)) {
                item.skillName = item.skill;
            } else {
                item.skillName = skillEnum.getValueByKey(item.skill);
            }
            item.levelName = skillLevelEnum.getValueByKey(item.level);
            return item;
        }), 'skill').reverse(), 'level').reverse();
    }

    getLanguages() {
        return this.putIds(this.getCandidateProfile().language);
    }

    extractLanguages() {
        return _.deepClone(this.getLanguages()) || [];
    }

    putLanguages(items) {
        this.getCandidateProfile().language = _.deepClone(items);
    }

    getLanguagesDisplaySorted() {
        return _.sortBy(_.sortBy(this.extractLanguages().map((item) => {
            item.levelName = languageLevelEnum.getValueByKey(item.level);
            item.languageName = languageEnum.getValueByKey(item.language);
            return item;
        }), 'languageName').reverse(), 'level').reverse();
    }

    getExpertise() {
        return this.getCandidateProfile().expertise || {};
    }

    extractExpertise() {
        return _.deepClone(this.getExpertise());
    }

    putExpertise(items) {
        this.getCandidateProfile().expertise = _.deepClone(items);
    }

    getSpecialities() {
        return this.getExpertise().specialities || [];
    }

    extractSpecialities() {
        return _.deepClone(this.getSpecialities());
    }

    getSpecialitiesDisplaySorted() {
        return _.sortBy(this.extractSpecialities().map((item) => {
            item.name = preferredRoleEnum.getValueByKey(item.key);
            item.experienceName = workExperienceEnum.getValueByKey(item.experience);
            item.sort = workExperienceEnum.getAttibuteFromKey(item.experience, 'sort');
            return item;
        }), 'sort').reverse();
    }

    getSignupStep() {
        const profile = this.getCandidateProfile();
        return _.getValue(profile, 'signup.nextStep') || 0;
    }

    getEmployerProfile() {
        return this.getData().data || {};
    }

    getCompanyId() {
        return this.getEmployerProfile().companyId || '';
    }

    normalizeData(data) {
        data.profile = data.profile || {};
        data.role = data.role || [];
    }

    putIds(items) {
        // if (_.isArrayNotEmpty(items)) {
        //     items.forEach((item) => {
        //         if (!('_id' in item)) {
        //             item._id = _.random(10000, 999999);
        //         }
        //     });
        // }

        return items;
    }

    getModificationDate() {
        const d = this.getData();
        const date = new Date(d.updatedAt);

        if (_.isDate(date)) {
            return date;
        }

        return _.isDate(d.createdAt) ? d.createdAt : null;
    }

    setModificationDate(date) {
        this.getData().updatedAt = date;
    }

    getModificationDateFormatted(format = 'MMMM Do YYYY') {
        const date = this.getModificationDate();

        if (_.isDate(date)) {
            return moment(date).format(format);
        }

        return '';
    }

    getLocationRefs() {
        let ids = [this.getResidence()];
        const cp = this.getCareerPreferences();

        if (!_.isEmpty(cp)) {

            if (!_.isUndefined(cp.permanent)) {

                if (_.isArrayNotEmpty(cp.permanent.preferredLocation)) {
                    ids = ids.concat(cp.permanent.preferredLocation);
                }
                if (_.isArrayNotEmpty(cp.permanent.otherLocation)) {
                    ids = ids.concat(cp.permanent.otherLocation);
                }
            }
            if (!_.isUndefined(cp.freelancer)) {

                if (_.isArrayNotEmpty(cp.freelancer.preferredLocation)) {
                    ids = ids.concat(cp.freelancer.preferredLocation);
                }
                if (_.isArrayNotEmpty(cp.freelancer.otherLocation)) {
                    ids = ids.concat(cp.freelancer.otherLocation);
                }
            }
        }

        return ids;
    }

    getSkillRefs() {
        const ids = [];
        const skills = this.getSkills();
        if (_.isArrayNotEmpty(skills)) {
            skills.forEach((item) => {
                if (Util.isId(item.skill)) {
                    ids.push(item.skill);
                }
            });
        }

        return ids;
    }

    getCompanyRefs() {
        const ids = [];
        const ep = this.getEmployerProfile();

        if (_.isStringNotEmpty(ep.companyId) && Util.isId(ep.companyId)) {
            ids.push(ep.companyId);
        }

        return ids;
    }

    getCreatedAtFormatted(format = 'DD.MM.YYYY') {
        const date = this.getCreatedAt();
        if (_.isStringNotEmpty(date) || _.isDate(date)) {
            return moment(date).format(format);
        }

        return '';
    }
};

export default M;
