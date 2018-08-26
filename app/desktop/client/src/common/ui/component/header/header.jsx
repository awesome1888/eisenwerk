import React from 'react';
import BaseComponent from '../../../lib/ui/component/index.jsx';

import classNames from 'classnames';
import Logo from '../logo/index.jsx';
import SelectCompact from '../util/select-compact/select-compact.jsx';
import mappingEnum from '../../../entity/mapping/enum/mapping-type.js';

import { Link } from 'react-router-dom';

import './style.less';

class NavBar extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            opened: false,
        };

        this.onMobileLinkClick = this.onMobileLinkClick.bind(this);
    }

    getHomePageUrl() {
        return '/';
    }

    getCurrentUrl() {
        const match = this.props.match;
        return this.stripQueryParameters(match.url);
    }

    getSection() {
        const match = this.props.match;
        return _.getValue(match, 'params.section');
    }

    /**
     * Check if url contains current path
     * todo: currently this method strips away any query parameters. improve this!
     * @param url
     * @returns {boolean}
     */
    checkUrlMatch(url) {
        if (!_.isString(url)) {
            return false;
        }
        return this.getCurrentUrl().indexOf(this.stripQueryParameters(url)) === 0;
    }

    toggleMobileMenu() {
        this.setState({
            opened: !this._opened,
        });
        this._opened = !this._opened;
    }

    closeMobileMenu() {
        this.setState({
            opened: false,
        });
        this._opened = false;
    }

    stripQueryParameters(url) {
        if (!_.isString(url)) {
            return '';
        }

        return url.replace(/\?[^?]*$/, '');
    }

    onMobileLinkClick() {
        this.closeMobileMenu();
    }

    getOptions(label, url) {
        const options = {
            Employers: [
                {key: 'company', value: 'Companies'},
                {key: 'recruiter', value: 'Recruiters'}
            ],
            Lists: [
                {key: 'city', value: 'Cities'},
                {key: 'skill', value: 'Skills'},
            ],
            Mapping: mappingEnum.getLinks()
        };
        return (options[label] || []).map((it) => {
            it.key = `${url}/${it.key}`;
            return it;
        });
    }

    onClickLink(values) {
        this.onMobileLinkClick();
        this.getRouter().go(values.key);
    }

    renderLink(url, label, options = {}) {
        if (options.mobile) {
            return (
                <div className="" key={url}>
                    <Link
                        to={url}
                        className={classNames({
                            'navbar__menu-link_mobile': true,
                            'navbar__menu-link_mobile_level2': options.level && options.level > 1,
                        })}
                        data-reset-scroll
                        onClick={this.onMobileLinkClick}
                        data-restrict-unfilled={options.restrict ? 'true' : 'false'}
                    >
                        {label}
                    </Link>
                    <div className="">
                        {this.getOptions(label, url).map((item) => {
                            return this.renderLink(item.key, item.value, Object.assign({}, options, {level: 2}));
                        })}
                    </div>
                </div>
            );
        } else {
            if (options.multiple) {
                return (<SelectCompact
                    className={classNames({
                        'navbar__menu-link-admin': true,
                        'navbar__menu-link-text_selected': this.checkUrlMatch(url),
                    })}
                    searchable={false}
                    placeholder={label}
                    options={this.getOptions(label, url)}
                    onChange={this.onClickLink.bind(this)}
                    multiple={false}
                    value={this.getSection()}
                    dynamicPlaceholder={false}
                />);
            }

            return (
                <Link
                    className={classNames({
                        'navbar__menu-link': true,
                        'navbar__menu-link-text_selected': this.checkUrlMatch(url),
                    })}
                    to={url}
                    data-reset-scroll
                    onClick={this.onMobileLinkClick}
                    data-restrict-unfilled={options.restrict ? 'true' : 'false'}
                >
                    {label}
                </Link>
            );
        }
    }

    renderUserMenu(user, mobile = false) {
        const isCandidate = user.hasRole('C');
        return (
            <nav className={`navbar__admin ${mobile ? 'navbar__admin_mobile' : 'navbar__menu-links'}`} role="navigation">
                {isCandidate && this.renderLink('/profile/view/all', t('Profile'), {mobile})}
                {this.renderLink('/account', t('Account'), {mobile})}
                {this.renderLink('/logout', t('Log out'), {mobile})}
            </nav>
        );
    }

    renderAdminMenu(user, mobile = false) {
        return (
            <nav className={`navbar__admin ${mobile ? 'navbar__admin_mobile' : 'navbar__menu-links'}`} role="navigation">
                {this.renderLink('/candidate', 'Candidates', {mobile, multiple: false})}
                {this.renderLink('/employer', 'Employers', {mobile, multiple: true})}
                {this.renderLink('/lists', 'Lists', {mobile, multiple: true})}
                {this.renderLink('/mapping', 'Mapping', {mobile, multiple: true})}
                {/* {this.renderLink('/mongo', 'Mongo', {mobile, multiple: false})} */}
                {this.renderLink('/logout', 'Log out', {mobile, multiple: false})}
            </nav>
        );
    }

    render() {
        const user = this.props.user;
        if (!_.isObjectNotEmpty(user)) {
            // not authorized
            return null;
        }

        return (
            <div className="navbars">
                <div className="navbar">
                    <div className="container-alt">
                        <div className="row-alt">
                            <div className="navbar__inner col-100 rb-padding-l_2x_mobile rb-padding-r_2x_mobile">
                                <Logo
                                    to={this.getHomePageUrl(user)}
                                    onClick={this.closeMobileMenu.bind(this)}
                                    height={21.3}
                                />
                                <div className="navbar__menu">
                                    {
                                        user.hasRole('A') ? this.renderAdminMenu(user) : this.renderUserMenu(user)
                                    }
                                    <div
                                        className={`navbar__menu-button ${this.state.opened ? 'navbar__menu-button__open' : ''}`}
                                        onClick={this.toggleMobileMenu.bind(this)}
                                    >
                                        <div className="menu_icon" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`navbar-menu-mobile ${this.state.opened ? 'navbar-menu-mobile_opened' : ''}`}>
                    {
                        user.hasRole('A') ? this.renderAdminMenu(user, true) : this.renderUserMenu(user, true)
                    }
                </div>
            </div>
        );
    }
}

export default NavBar.connect({
    router: true,
    store: store => store.global,
});
