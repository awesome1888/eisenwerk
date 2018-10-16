import React, {Component} from 'react';
import connectField from 'uniforms/connectField';
import ButtonLikeSelectbox from '../../../util/button-like-selectbox/button-like-selectbox.jsx';
import wrapField from './../../config/wrap-field.jsx';

class ButtonLikeSelectboxField extends Component {
    render() {
        const props = this.props;
        return wrapField(
            ({feedbackable: true, ...props}), (
                <ButtonLikeSelectbox
                    name={props.name}
                    options={props.options}
                    // onChange={(value) => {
                    //     props.onChange(value && value.value);
                    // }}
                    multiple={props.multiple}
                    value={props.value}
                    className={props.className}
                    placeholder={props.placeholder}
                    onClick={props.onClick}
                    onValueRender={props.onValueRender}
                    classNameIcon={props.classNameIcon}
                    {...props}
                />
            )
        );
    }
}

export {ButtonLikeSelectbox};
export default connectField(ButtonLikeSelectboxField);
