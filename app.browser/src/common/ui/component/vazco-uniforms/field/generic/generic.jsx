import React from 'react';
import classnames from 'classnames';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

const Generic = ({
    children,
    className,
    error,
    errorMessage,
    label,
    name,
    ...props
}) =>
    <div
        className={classnames('form__block', {'form__block_has-errors': error}, className)}
        name={name}
    >
        <div
            className="form__block-inner"
            {...filterDOMProps(props)}
        >
            {children}
        </div>
        {(error && errorMessage) && (
            <span className="form__error form__block-error">
                {errorMessage}
            </span>
        )}
    </div>
;

export default connectField(Generic, {includeInChain: true});
