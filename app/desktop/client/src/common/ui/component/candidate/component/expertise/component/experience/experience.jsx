import React from 'react';
import joinName from 'uniforms/joinName';

import FormRow from '../../../../../form/form.row/form.row.jsx';
import FormSelect from '../../../../../form/form.select/form.select.jsx';

import workExperienceEnum from '../../../../../../../entity/user/enum/candidate.work-experience.enum.js';
import preferredRoleEnum from '../../../../../../../entity/user/enum/candidate.preferred-role.enum.js';

export default class ExperienceForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
        };
    }

    getLabel() {
        const model = this.props.model;
        return preferredRoleEnum.getValueByKey(model.key);
    }

    render() {
        return (<div>
            <FormRow simple>
                <FormSelect
                    label={`${this.getLabel()} ${t('experience')}`}
                    name={joinName(this.state.name, 'experience')}
                    options={workExperienceEnum}
                    multiple={false}
                />
            </FormRow>
        </div>);
    }
}
