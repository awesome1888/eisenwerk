import React from 'react';
import joinName from 'uniforms/joinName';

import FormRow from '../../../../../form/form.row/form.row.jsx';
import FormSelect from '../../../../../form/form.select/form.select.jsx';

import languageEnum from '../../../../../../../lib/enum/language.enum.js';
import languageLevelEnum from '../../../../../../../lib/enum/language-level.enum.js';

export default class LanguageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
        };
    }

    render() {
        return (
            <div className="group_vertical_inline">
                <FormRow simple>
                    <FormSelect
                        label={t('Language and level of proficiency')}
                        name={joinName(this.state.name, 'language')}
                        options={languageEnum.selectizeSorted()}
                        multiple={false}
                    />
                </FormRow>
                <FormRow simple>
                    <FormSelect
                        name={joinName(this.state.name, 'level')}
                        options={languageLevelEnum.selectize()}
                        multiple={false}
                    />
                </FormRow>
            </div>
        );
    }
}
