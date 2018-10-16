import React from 'react';

export default class FormField extends React.Component {
    render() {
        const {className, label, ...props} = this.props;
        const Component = this.props.component;
        return (
            <div className={className || 'small-12'}>
                {label && <div className="form__label">
                    {label}
                </div>}
                <div className="form__control">
                    <Component
                        {...props}
                    />
                </div>
            </div>
        );
    }
}
