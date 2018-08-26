import React, {Component} from 'react';
import connectField from 'uniforms/connectField';
import wrapField from './../../config/wrap-field.jsx';
import classnames from 'classnames';

class Text extends Component {
    render() {
        const props = this.props;
        return wrapField(({
            feedbackable: false,
            ...props,
            error: props.error || props.errorMessageServer,
            errorMessage: props.errorMessage || props.errorMessageServer,
        }), (
            <input
                className={classnames(props.inputClassName, 'form-control', {'form-control-danger': props.error})}
                disabled={props.disabled}
                id={props.id}
                name={props.name}
                onChange={(event) => {
                    if (props.errorMessageServer && props.clearServerError) {
                        props.clearServerError();
                    }
                    return props.onChange(event.target.value);
                }}
                placeholder={props.placeholder}
                ref={props.inputRef}
                type={props.type || 'text'}
                value={props.value}
                autoCapitalize={props.autoCapitalize}
                autoComplete={props.autoComplete ? 'true' : 'false'}
            />
        ));
    }
}

export default connectField(Text);
