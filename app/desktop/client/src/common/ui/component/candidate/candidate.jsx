import React from 'react';
import BaseComponent from '../../../lib/ui/component/index.jsx';
import query from './query/query.js';
import List from './component/list/list.jsx';
import CandidatePreview from './component/preview/index.jsx';
import PageScroll from '../../../lib/util/page-scroll/page-scroll.js';
import EventEmitter from './../../../lib/util/event/event.js';

// sub-forms
import CareerPreferenceItem from './component/career-preference/career-preference.jsx';
import PersonalInformation from './component/personal-information/personal-information.js';
import EducationHighItem from './component/education-high-item/education-high-item.jsx';
import WorkExperienceItem from './component/work-experience-item/work-experience-item.jsx';
import LanguageItem from './component/language/language.jsx';
import DocumentItem from './component/document-item/document-item.jsx';
import ExpertiseItem from './component/expertise/expertise.jsx';
import SkillItem from './component/skill/skill.jsx';


import workExperienceEnum from '../../../entity/user/enum/candidate.work-experience.enum.js';
import nrReportingEnum from '../../../entity/user/enum/candidate.number-reporting.enum.js';
import searchStatusEnum from '../../../entity/user/enum/candidate.search-status.enum.js';
import noticePeriodEnum from '../../../entity/user/enum/candidate.notice-period.enum.js';
import targetRateEnum from '../../../entity/user/enum/candidate.target-rate.enum.js';
import targetSalaryEnum from '../../../entity/user/enum/candidate.target-salary.enum.js';
import workRemoteEnum from '../../../entity/user/enum/candidate.work-remote.enum.js';
import preferredRoleEnum from '../../../entity/user/enum/candidate.preferred-role.enum.js';
import preferredCompanyEnum from '../../../entity/user/enum/candidate.preferred-company.enum.js';
import preferenceTypeEnum from '../../../entity/user/enum/candidate.preference-type.enum.js';

// sides
import { PageDefaultBlock } from './../../../ui/component/page-default/page-default.jsx';

import './style.less';

class Candidate extends BaseComponent {

    constructor(props) {
        super(props);
        this.registerEventEmitters();
    }

    registerEventEmitters() {
        EventEmitter.on('candidate-reload', this._reloadListener = () => {
            this.onSave();
        });
    }

    unregisterEventEmitters() {
        EventEmitter.off('candidate-reload', this._reloadListener);
    }

    getUserId() {
        return this.props.id;
    }

    componentWillMount() {
        this.setTitle(t('Profile'));
    }

    componentWillUnmount() {
        this.unregisterEventEmitters();
    }

    componentWillReceiveProps(props) {
        if ('section' in props && props.section === 'view') {
            this.setTitle(t('Profile'));
        }
    }

    componentDidMount() {
        super.componentDidMount();
        PageScroll.clear();
    }

    componentDidUpdate() {
        if (this.isViewSection()) {
            PageScroll.scrollToStored();
        }
    }

    componentWillUpdate() {
        if (this.isViewSection()) {
            // performed after submitting any form
            // (data is reloaded, so the component will be updated second time, it will cause scrolling to the top)
            PageScroll.store();
        }
    }

    getIdPropertyCode() {
        return 'id';
    }

    getDataQuery() {
        return query;
    }

    setDataLoaded(res) {
        const instance = res; // ? new CandidateEntity(res) : null;
        if (instance) {
            instance.populate().then(() => {
                this.setDataLoadedProceed(res, instance);
            });
        } else {
            this.setDataLoadedProceed(res, instance);
        }
    }

    setDataLoadedProceed(res, instance) {
        EventEmitter.emit('candidate-edit', [
            instance,
        ]);

        const res2 = _.deepClone(res);
        // res2 = res2 ? new CandidateEntity(res2) : null;
        this.setData(res2);
    }

    getPathTemplate() {
        return this.props.pathTemplate || '';
    }

    getId() {
        const d = this.getData();
        if (d) {
            return d.getId();
        }

        return null;
    }

    getSection() {
        return _.getValue(this.props, 'match.params.section') || 'view';
    }

    getItem() {
        return _.getValue(this.props, 'match.params.item') || 'all';
    }

    getEditUrl() {
        let path = this.getPathTemplate().replace(':id', this.getId());
        // if (_.isStringNotEmpty(path)) {
        //     // attach backurl
        //     path = `${path}?backUrl=${this.makeBackUrl()}`;
        // }

        return path;
    }

    getEditSectionUrl() {
        return this.getPathTemplate().replace(':item', 'edit');
    }

    getNewUrl(section) {
        return this.getPathTemplate().replace(':item', 'new').replace(':section', section);
    }

    showEditControls() {
        return !!this.props.enableEdit;
    }

    onAvatarUploaded(url) {
        this.getData().setAvatar(url);
        this.save();
    }

    isViewSection() {
        return this.getSection() === 'view';
    }

    getController(section) {
        switch (section) {
            case 'main':
                return PersonalInformation;
            case 'education':
                return EducationHighItem;
            case 'work-experience':
                return WorkExperienceItem;
            case 'language':
                return LanguageItem;
            case 'document':
                return DocumentItem;
            case 'career-preference':
                return CareerPreferenceItem;
            case 'expertise':
                return ExpertiseItem;
            case 'skill':
                return SkillItem;
            default:
                return null;
        }
    }

    save() {
        // const users = this.getApplication().getNetwork().service('users');
        // return users.patch(this.getUserId(), this.getData().getData()).then(() => {
        //     return this.getData().populate(); // upload missing enum items
        // }).then(() => {
        //     this.forceUpdate();
        // });
    }
    
    onSave() {
        this.startDataReload(this.props);
    }

    renderLocation(candidate) {
        return (<span>{t('Lives in $(0)', candidate.getResidence())}</span>);
    }

    makeLink(section, item) {
        return this.getEditUrl().replace(':section', section).replace(':item', item);
    }

    getCareerPreferencesData() {
        const cp = this.getData().extractCareerPreference();

        const result = [];

        if (!_.isEmpty(cp.permanent) && _.contains(cp.type, preferenceTypeEnum.PERMANENT)) {

            result.push({
                value: 'Permanent job opportunities',
                type: 'title'
            });

            if (_.isStringNotEmpty(cp.permanent.searchStatus)) {
                result.push({
                    key: cp.permanent.searchStatus,
                    value: searchStatusEnum.getValueByKey(cp.permanent.searchStatus),
                    markerClassName: 'icon_search',
                });
            }
            if (_.isStringNotEmpty(cp.permanent.noticePeriod)) {
                result.push({
                    key: cp.permanent.noticePeriod,
                    value: noticePeriodEnum.getAttibuteFromKey(cp.permanent.noticePeriod, 'display'),
                    markerClassName: 'icon_event',
                });
            }
            if (_.isStringNotEmpty(cp.permanent.targetSalary)) {
                result.push({
                    key: cp.permanent.targetSalary,
                    value: targetSalaryEnum.getAttibuteFromKey(cp.permanent.targetSalary, 'display'),
                    markerClassName: 'icon_attach-money',
                });
            }
            if (_.isStringNotEmpty(cp.permanent.workRemote)) {
                result.push({
                    key: cp.permanent.workRemote,
                    value: workRemoteEnum.getAttibuteFromKey(cp.permanent.workRemote, 'display'),
                    markerClassName: 'icon_home',
                });
            }
            if (_.isArrayNotEmpty(cp.permanent.preferredRole)) {
                let prValues = preferredRoleEnum.valuesFromKeys(cp.permanent.preferredRole);
                prValues = prValues.filter(n => n); // remove null values

                result.push({
                    key: cp.permanent.preferredRole,
                    value: prValues.join(', '),
                    markerClassName: 'icon_work',
                });
            }
            if (_.isArrayNotEmpty(cp.permanent.preferredCompany)) {
                let pcValues = preferredCompanyEnum.valuesFromKeys(cp.permanent.preferredCompany);
                pcValues = pcValues.filter(n => n); // remove null values

                result.push({
                    key: cp.permanent.preferredCompany,
                    value: pcValues.join(', '),
                    markerClassName: 'icon_domain',
                });
            }

            if (_.isArrayNotEmpty(cp.permanent.preferredLocation)) {
                const plValues = this.getData().getCareerPreferenceLocationsDisplay(cp.permanent);

                result.push({
                    key: cp.preferredLocation,
                    value: plValues.join(', '),
                    markerClassName: 'icon_place',
                });
            }
        }

        if (!_.isEmpty(cp.freelancer) && _.contains(cp.type, preferenceTypeEnum.FREELANCE)) {

            result.push({
                value: 'Freelance job opportunities',
                type: 'title',
                className: 'margin-top_x2'
            });

            if (_.isStringNotEmpty(cp.freelancer.targetRate)) {
                result.push({
                    key: cp.freelancer.targetRate,
                    value: targetRateEnum.getAttibuteFromKey(cp.freelancer.targetRate, 'display'),
                    markerClassName: 'icon_attach-money',
                });
            }
            if (_.isStringNotEmpty(cp.freelancer.workRemote)) {
                result.push({
                    key: cp.freelancer.workRemote,
                    value: workRemoteEnum.getAttibuteFromKey(cp.freelancer.workRemote, 'display'),
                    markerClassName: 'icon_home',
                });
            }
            if (_.isArrayNotEmpty(cp.freelancer.preferredRole)) {
                let prValues = preferredRoleEnum.valuesFromKeys(cp.freelancer.preferredRole);
                prValues = prValues.filter(n => n); // remove null values

                result.push({
                    key: cp.freelancer.preferredRole,
                    value: prValues.join(', '),
                    markerClassName: 'icon_work',
                });
            }
            if (_.isArrayNotEmpty(cp.freelancer.preferredCompany)) {
                let pcValues = preferredCompanyEnum.valuesFromKeys(cp.freelancer.preferredCompany);
                pcValues = pcValues.filter(n => n); // remove null values

                result.push({
                    key: cp.freelancer.preferredCompany,
                    value: pcValues.join(', '),
                    markerClassName: 'icon_domain',
                });
            }
            if (_.isArrayNotEmpty(cp.freelancer.preferredLocation)) {
                const plValues = this.getData().getCareerPreferenceLocationsDisplay(cp.freelancer);

                result.push({
                    key: cp.preferredLocation,
                    value: plValues.join(', '),
                    markerClassName: 'icon_place',
                });
            }
        }

        return result;
    }

    renderCareerPreferences() {
        let i = 0;
        const cp = this.getCareerPreferencesData();

        return cp.map((item) => {
            return {
                item,
                ui: (
                    <div className="rb-group_x0p5" key={i++}>
                        <div className="">
                            {item.value}
                        </div>
                    </div>
                ),
            };
        });
    }

    renderHighEducation() {
        let i = 0;
        return this.getData().getEducation().map((item) => {
            const years = [];
            if (_.isStringNotEmpty(item.start)) {
                years.push(item.start);
            }
            if (_.isStringNotEmpty(item.end)) {
                years.push(item.end);
            }

            return {
                item,
                ui: (
                    <div className="rb-group_x0p5" key={i++}>
                        {
                            item.universityName &&
                            <div className="candidate-view__link-header candidate-view__highlight-this">
                                {item.universityName}
                            </div>
                        }
                        {
                            item.courseName
                            &&
                            <div>
                                {item.courseName}
                            </div>
                        }
                        {
                            _.isArrayNotEmpty(years)
                            &&
                            <div className="text_color_gray">
                                {years.join(' - ')}
                            </div>
                        }
                    </div>
                ),
            };
        });
    }

    renderWorkExperience() {
        let i = 0;
        return this.getData().getWorkExperienceDisplay().map((item) => {
            const dates = [];
            if (_.isStringNotEmpty(item.start)) {
                dates.push(item.start);
            }
            if (item.current) {
                dates.push(t('Today'));
            } else if (_.isStringNotEmpty(item.end)) {
                dates.push(item.end);
            }

            return {
                item,
                ui: (
                    <div className="rb-group_x0p5" key={i++}>
                        <div className="candidate-view__link-header candidate-view__highlight-this">
                            {item.companyName}
                        </div>
                        {
                            _.isStringNotEmpty(item.occupation)
                            &&
                            <div>
                                {item.occupation}
                            </div>
                        }
                        {
                            _.isStringNotEmpty(item.description)
                            &&
                            <div>
                                {item.description}
                            </div>
                        }
                        {
                            _.isArrayNotEmpty(dates)
                            &&
                            <div className="text_color_gray">
                                {dates.join(' - ')}
                            </div>
                        }
                    </div>
                ),
            };
        });
    }

    getExpertiseData() {
        const expertise = this.getData().extractExpertise();
        const specialities = this.getData().getSpecialitiesDisplaySorted();
        const result = [];

        if (_.isStringNotEmpty(expertise.overall)) {
            result.push({
                key: expertise.overall,
                value: `${workExperienceEnum.getValueByKey(expertise.overall)} overall work experience`,
                markerClassName: 'icon_work',
            });
        }

        if (_.isArrayNotEmpty(specialities)) {
            _.each(specialities, (item) => {
                result.push({
                    key: item.key,
                    value: `${item.experienceName} ${item.name} experience`,
                    markerClassName: 'icon_work',
                });
            });
        }
        if (_.isStringNotEmpty(expertise.nrReporting)) {
            result.push({
                key: expertise.nrReporting,
                value: `${nrReportingEnum.getValueByKey(expertise.nrReporting)} people in the reporting line`,
                markerClassName: 'icon_people',
            });
        }

        return result;
    }

    renderExpertise() {
        let i = 0;

        const expertise = this.getExpertiseData();

        return expertise.map((item) => {
            return {
                item,
                ui: (
                    <div className="rb-group_x0p5" key={i++}>
                        <div className="">
                            {item.value}
                        </div>
                    </div>
                ),
            };
        });
    }

    renderSkills() {
        let i = 0;
        return this.getData().getSkillsDisplaySorted().map((item) => {
            return {
                item,
                ui: (
                    <div className="rb-group_x0p5" key={i++}>
                        <div className="">
                            {item.skillName} {
                            _.isStringNotEmpty(item.levelName)
                            &&
                            <span>
                                ({item.levelName})
                            </span>
                        }
                        </div>
                    </div>
                ),
            };
        });
    }

    renderLanguages() {
        let i = 0;
        return this.getData().getLanguagesDisplaySorted().map((item) => {
            return {
                item,
                ui: (
                    <div className="rb-group_x0p5" key={i++}>
                        <div className="">
                            {item.languageName} {
                            _.isStringNotEmpty(item.levelName)
                            &&
                            <span>
                                    ({item.levelName})
                                </span>
                        }
                        </div>
                    </div>
                ),
            };
        });
    }

    renderDocuments() {
        let i = 0;
        return this.getData().getDocumentDisplay({dateFormat: 'DD.MM.YYYY'}).map((item) => {
            return {
                item,
                ui: (
                    <div className="rb-group_x0p5" key={i++}>
                        <div className="candidate-view__link-header candidate-view__highlight-this">
                            {item.type}
                        </div>
                        {
                            _.isStringNotEmpty(item.createdAt)
                            &&
                            <div>
                                {t('Uploaded: $(0)', item.createdAt)}
                            </div>
                        }
                    </div>
                ),
            };
        });
    }

    renderItem({label, props}) {
        return (
            <div key={props.code}>
                <PageDefaultBlock border>
                    <div className="candidate-profile-view__item-header">
                        {label}
                    </div>
                    <List
                        {...props}
                    />
                </PageDefaultBlock>
            </div>
        );
    }

    getItems() {
        return [
            {label: t('Career preferences'), props: {data: this.renderCareerPreferences(), markerClassName: 'icon_work', code: 'career-preference', pathTemplate: this.getEditSectionUrl(), type: 'edit'}},
            {label: t('Expertise'), props: {data: this.renderExpertise(), markerClassName: 'icon_work', code: 'expertise', pathTemplate: this.getEditSectionUrl(), type: 'edit'}},
            {label: t('Skills'), props: {data: this.renderSkills(), markerClassName: 'icon_build', code: 'skill', pathTemplate: this.getEditSectionUrl(), type: 'edit'}},
            {label: t('Languages'), props: {data: this.renderLanguages(), markerClassName: 'icon_chat', code: 'language', pathTemplate: this.getEditSectionUrl(), type: 'edit'}},
            {label: t('Professional experience'), props: {data: this.renderWorkExperience(), markerClassName: 'icon_store-mall-directory', code: 'work-experience', pathTemplate: this.getEditUrl(), type: 'add'}},
            {label: t('Education'), props: {data: this.renderHighEducation(), markerClassName: 'icon_school', code: 'education', pathTemplate: this.getEditUrl(), type: 'add'}},
            {label: t('Documents'), props: {data: this.renderDocuments(), markerClassName: 'icon_attach-file', code: 'document', pathTemplate: this.getEditUrl(), type: 'add'}}
        ];
    }


    renderView() {
        const candidateEntity = this.getData();

        if (!candidateEntity) {
            return null; //this.renderLoading();
        }

        return (
            <div className="block-stack rb-relative">
                <CandidatePreview
                    data={candidateEntity}
                    enableEdit={this.showEditControls()}
                    link={this.makeLink('main', 'data')}
                    onAvatarUploaded={this.onAvatarUploaded.bind(this)}
                />

                {
                    this.hasChildren()
                    &&
                    <div className="no-border">
                        {this.getChildren()}
                    </div>
                }
                {
                    _.map(this.getItems(), it => this.renderItem(it))
                }
            </div>
        );
    }

    render() {
        if (!this.isReady()) {
            return null;
        }

        const section = this.getSection();

        const CentralController = this.getController(section);

        return (
            <div>
                {
                    (CentralController !== null)
                    &&
                    <CentralController
                        path={this.getPathTemplate()}
                        data={this.getData()}
                        section={section}
                        item={this.getItem()}
                        onSubmit={this.onSave.bind(this)}
                    />
                }
                {
                    (CentralController === null)
                    &&
                    this.renderView()
                }
            </div>
        );
    }
}

export default Candidate.connect({
    store: store => store.global,
    context: true,
    router: true,
});
