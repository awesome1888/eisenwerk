import React, {Component} from 'react';
import connectField from 'uniforms/connectField';
import wrapField from './../../config/wrap-field.jsx';
import ButtonSelector from '../../../util/button-selector/button-selector.jsx';

class SelectGiantButton extends Component {
    render() {
        const props = this.props;
        return wrapField(
            ({feedbackable: true, showError: true, ...props}),
            (
                <ButtonSelector
                    {...props}
                />
            )
        );
    }
}

export default connectField(SelectGiantButton);
