import React from 'react';

export default class PageDefault extends React.Component {
    render() {
        const props = this.props;
        return (
            <div className={`data-block ${this.props.className || ''} ${!this.props.border && 'no-border'}`}>
                {
                    (props.title || props.subtitle) &&
                        <div className="margin-bottom_double">
                            <h2 className="rb-f-size_x1p5 no-margin">
                                {props.title}
                            </h2>
                            {
                                props.subtitle &&
                                <div className="rb-margin-t_x0p5 text_size_normal">
                                    {props.subtitle}
                                </div>
                            }
                        </div>
                }
                <div className="form">
                    <div className="form__block uniforms-list-field">
                        <div className="form__block-inner form__block-inner-limited">
                            <div className="group_vertical_double">
                                {props.children}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export class PageDefaultBlock extends React.Component { // eslint-disable-line
    render() {
        return (
            <div className={`data-block ${!this.props.border && 'no-border'}`}>
                <div className={`data-block__content-form ${this.props.className || ''}`}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

