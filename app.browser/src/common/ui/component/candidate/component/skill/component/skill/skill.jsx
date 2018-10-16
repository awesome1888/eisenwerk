import React from 'react';
import joinName from 'uniforms/joinName';

import BaseComponent from '../../../../../../../lib/ui/component/index.jsx';
import FormRow from '../../../../../form/form.row/form.row.jsx';
import FormSelect from '../../../../../form/form.select/form.select.jsx';

import skillEnum from '../../../../../../../entity/skill/enum/skill.enum.js';
import skillLevelEnum from '../../../../../../../entity/skill/enum/skill-level.enum.js';


export default class SkillForm extends BaseComponent {
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
                        label={t('Skill and level of proficiency')}
                        name={joinName(this.state.name, 'skill')}
                        options={skillEnum}
                        multiple={false}
                        allowMissingValue
                        searchDebounce={600}
                        localSearch={false}
                    />
                </FormRow>
                <FormRow simple>
                    <FormSelect
                        name={joinName(this.state.name, 'level')}
                        options={skillLevelEnum}
                        multiple={false}
                    />
                </FormRow>
            </div>
        );
    }
}
