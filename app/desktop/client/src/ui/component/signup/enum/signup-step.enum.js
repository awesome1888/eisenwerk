import EnumFactory from '../../../../common/lib/util/enum-factory/index.js';
import CareerPreferenceForm from '../../../../common/ui/component/candidate/component/career-preference/career-preference.jsx';
import ExpertiseForm from '../../../../common/ui/component/candidate/component/expertise/expertise.jsx';
import SkillForm from '../../../../common/ui/component/candidate/component/skill/skill.jsx';
import LanguageForm from '../../../../common/ui/component/candidate/component/language/language.jsx';
import Account from '../../account/account.jsx';

class SignupStepEnumFactory extends EnumFactory {
    constructor(items) {
        super(items || [
            {key: 'career-preference', value: '/signup/career-preference', controller: CareerPreferenceForm, params: {hidePrevButton: true}, index: 0},
            {key: 'expertise', value: '/signup/expertise', controller: ExpertiseForm, params: {backUrl: '/signup/career-preference'}, index: 1},
            {key: 'skill', value: '/signup/skill', controller: SkillForm, params: {backUrl: '/signup/career-preference'}, index: 2},
            {key: 'language', value: '/signup/language', controller: LanguageForm, params: {backUrl: '/signup/career-preference'}, index: 3},
            {key: 'account', value: '/signup/account', controller: Account, params: {}, index: 4},
        ]);
    }
}

export default new SignupStepEnumFactory();
