import React from 'react';
import gridClassName from './grid-class-name.jsx';
import classnames from 'classnames';

const wrapField = (props, inner) => {
    return (
        <Wrapper {...props}>
            {inner}
        </Wrapper>
    );
};

class Wrapper extends React.Component {
    render() {
        const grid = this.props.grid;
        const wrapClassName = this.props.wrapClassName;
        const errorMessage = this.props.errorMessage;
        const showError = this.props.showError !== false;
        const error = this.props.error;
        const hasWrap = !!(grid || wrapClassName);

        return (
            <section
                className={classnames(
                    this.props.className,
                    'field',
                    'form-group',
                    {
                        'has-error': error,
                        disabled: this.props.disabled,
                        required: this.props.required
                    }
                )}
            >
                {hasWrap && (
                    <section className={classnames(wrapClassName, gridClassName(grid, 'input'))}>
                        {this.props.children}
                        {
                            (_.isStringNotEmpty(errorMessage) && showError)
                            &&
                            <span className="form__error">
                                {errorMessage}
                            </span>
                        }
                    </section>
                )}

                {
                    !hasWrap
                    &&
                    this.props.children
                }
                {
                    (!hasWrap && _.isStringNotEmpty(errorMessage) && showError)
                    &&
                    <span className="form__error">
                        {errorMessage}
                    </span>
                }
            </section>
        );
    }
}

export default wrapField;
