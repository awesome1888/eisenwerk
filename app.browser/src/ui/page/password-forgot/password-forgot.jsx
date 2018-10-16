import React from 'react';
// import PropTypes from 'prop-types';
import BasePage from '../../../common/lib/ui/page/index.jsx';
import Layout from '../../../common/ui/component/layout.page.one-column/index.jsx';
import PasswordForgot from '../../component/password-forgot/password-forgot.jsx';

export default class PasswordForgotPage extends BasePage {
    render() {
        return (
            <Layout
                central={
                    <PasswordForgot
                        application={this.props.application}
                    />
                }
            />
        );
    }
}
