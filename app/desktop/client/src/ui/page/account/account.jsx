import React from 'react';
// import PropTypes from 'prop-types';
import BasePage from '../../../common/lib/ui/page/index.jsx';
import Layout from '../../../common/ui/component/layout.page.one-column/index.jsx';
import Account from '../../component/account/account.jsx';

export default class AccountPage extends BasePage {
    render() {
        return (
            <Layout
                central={
                    <Account />
                }
            />
        );
    }
}
