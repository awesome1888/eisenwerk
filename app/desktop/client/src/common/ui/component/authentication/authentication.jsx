import React from 'react';
// import OptionBar from '../../../../app/desktop/client/src/ui/component/option-bar/option-bar.jsx';
import Logo from './../logo/index.jsx';

export default class Authentication extends React.Component {

    getWrapperSize() {
        if (this.props.big) {
            return 'big';
        }
        return 'small';
    }

    renderHeader() {
        if (this.props.header) {
            return this.props.header;
        }
        return (
            <div className="margin-bottom_double">
                <Logo
                    to="https://sevenlanes.com"
                    rel="noopener noreferrer"
                />
            </div>
        );
    }

    render() {
        return (
            <div className="signup-block hack__controls-deface">
                <div className="signup-block__wrapper">
                    <div className={`signup-block__wrapper-content signup-block__wrapper-content-${this.getWrapperSize()}`}>
                        <div className="block-stack">
                            <div className="data-block signup-block__container">
                                <div className={`data-block__content ${this.props.innerClass || ''}`}>
                                    {
                                        this.renderHeader()
                                    }
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                        {
                            !_.isEmpty(this.props.footer) &&
                            this.props.footer
                        }
                    </div>
                </div>
            </div>
        );
    }
}
