import React, {Component} from 'react';
import connectField from 'uniforms/connectField';
import wrapField from './../../config/wrap-field.jsx';
import locationEnum from '../../../../../entity/location/enum/location.enum.js';
import Select from '../../../util/select/select.jsx';
import countryEnum from '../../../../../entity/location/enum/country.enum.js';

import './style.less';

class PlaceAutocomplete extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getEnum() {
        if (!this._enum) {
            this._enum = locationEnum.clone();
        }

        return this._enum;
    }

    onRenderItem(item) {
        return `${item.cityName}, ${countryEnum.getValueByKey(item.countryCode)}`;
    }

    render() {
        const props = this.props;
        return wrapField(({feedbackable: true, ...props}), (
            <Select
                {...props}
                onRenderListItem={this.onRenderItem.bind(this)}
                placeholder={props.placeholder || ''}
                multiple={false}
                allowMissingValue
                options={this.getEnum()}
                searchDebounce={600}
                localSearch={false}
                onChange={(value) => {
                    if (props.onChange2) {
                        props.onChange2(value && value.key);
                    }

                    if (!_.isFunction(props.onChange)) {
                        console.error('onChange() is unassigned');
                        return;
                    }

                    if (props.multiple) {
                        if (value && value.length === 0) {
                            props.onChange(null);
                        } else {
                            props.onChange(value && _.pluck(value, 'key'));
                        }
                    } else {
                        if (props.returnArray) {
                            if (value && value.key) {
                                props.onChange([value.key]);
                            } else {
                                props.onChange(value.key);
                            }
                        } else {
                            props.onChange(value && value.key);
                        }
                    }
                }}
            />
        ));
    }
}

export const FieldClass = PlaceAutocomplete;
export default connectField(PlaceAutocomplete);
