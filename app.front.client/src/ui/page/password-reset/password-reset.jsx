import React from 'react';
// import PropTypes from 'prop-types';
import BasePage from '../../../common/lib/ui/page/index.jsx';
import Layout from '../../../common/ui/component/layout.page.one-column/index.jsx';
import PasswordReset from '../../component/password-reset/password-reset.jsx';

export default class PasswordResetPage extends BasePage {
    render() {
        return (
            <Layout
                central={
                    <PasswordReset
                        application={this.props.application}
                    />
                }
            />
        );
    }
}
