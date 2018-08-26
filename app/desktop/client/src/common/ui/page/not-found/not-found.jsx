import React from 'react';
import BasePage from '../../../lib/ui/page/index.jsx';
import Authentication from '../../component/authentication/authentication.jsx';
import PageDefault from '../../component/page-default/page-default.jsx';
import { Link } from 'react-router-dom';

class NotFoundPage extends BasePage {
    render() {
        return (
            <Authentication optionBar={!this.props.user && {register: true, login: true, employers: true}}>
                <PageDefault
                    title={`404 – ${t("This page doesn't exist")}`}
                    subtitle={t('We have no solution, but we admire the problem.')}
                >
                    <Link to="/" className="button button_blue">
                        {t('Home')}
                    </Link>
                </PageDefault>
            </Authentication>
        );
    }
}

export default NotFoundPage.connect({
    store: store => store.global,
});
