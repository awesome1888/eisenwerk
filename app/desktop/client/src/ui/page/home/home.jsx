import React from 'react';
// import PropTypes from 'prop-types';
import BasePage from '../../../common/lib/ui/page/index.jsx';
import Layout from '../../../common/ui/component/layout.page.one-column/index.jsx';
import PageDefault, { PageDefaultBlock } from './../../../common/ui/component/page-default/page-default.jsx';
import { Link } from 'react-router-dom';

export default class HomePage extends BasePage {

    renderContent() {
        return (
            <PageDefault
                title={t('Maintenance')}
                subtitle={t('We are currently publishing new functionalities. Therefore, the usability of our platform will be limited in the coming days. We will contact you as soon as the maintenance work is completed.')}
            >
                <Link to="/logout" className="button button_blue">
                    {t('Log out')}
                </Link>
            </PageDefault>
        );
    }

    render() {
        return (
            <Layout
                central={
                    <div className="block-stack form_width__limited">
                        <div className="form__block-inner-limited">
                            <PageDefaultBlock>
                                {this.renderContent()}
                            </PageDefaultBlock>
                        </div>
                    </div>
                }
            />
        );
    }
}
