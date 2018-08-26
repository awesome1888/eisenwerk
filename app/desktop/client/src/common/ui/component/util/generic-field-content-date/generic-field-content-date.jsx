import React from 'react';
import Select from '../../vazco-uniforms/field/select/select.jsx';
import yearEnum from '../../../../lib/enum/year.enum.js';
import monthEnum from '../../../../lib/enum/month.enum.js';

export default class GenericFieldContentDate extends React.Component {
    render() {
        return (
            <div className="form__control">
                <div className="rb-content_row_top rb-group_x">
                    <Select
                        name="month"
                        options={monthEnum.selectize()}
                        multiple={false}
                        placeholder={t('Month')}
                    />
                    <Select
                        name="year"
                        options={yearEnum.selectizeInverse()}
                        multiple={false}
                        placeholder={t('Year')}
                    />
                </div>
            </div>
        );
    }
}
