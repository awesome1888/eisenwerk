import React from 'react';
// import PropTypes from 'prop-types';
import BasePage from '../../../common/lib/ui/page/index.jsx';
import Layout from '../../../common/ui/component/layout.page.one-column/index.jsx';
import Login from '../../component/login/login.jsx';

export default class HomePage extends BasePage {
    render() {
        return (
            <Layout
                central={
                    <Login />
                }
            />
        );
    }
}
