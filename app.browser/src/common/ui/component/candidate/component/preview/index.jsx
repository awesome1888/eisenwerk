import React from 'react';
import BaseComponent from '../../../../../lib/ui/component/index.jsx';
import { PageDefaultBlock } from '../../../page-default/page-default.jsx';
import Util from '../../../../../lib/util/index.js';
import ImageUser from './../personal-information/component/image-user/image-user.jsx';
import { Link } from 'react-router-dom';

import './style.less';

export default class CandidatePreview extends BaseComponent {

    getData() {
        return this.props.data;
    }

    isSmall() {
        return !!this.props.isSmall;
    }

    showEditControls() {
        return !!this.props.enableEdit;
    }

    getLink() {
        return this.props.link || '';
    }

    displayMissing() {
        return !!this.props.displayMissing;
    }

    renderTitle() {
        const d = this.getData();
        let age = '';

        if (d.hasBirthDate()) {
            age = d.getAge().toString();
        } else if (this.displayMissing()) {
            age = t('Age');
        }

        return `${d.getFullName()}${_.isStringNotEmpty(age) ? ` (${age})` : ''}`;
    }

    renderLocation() {
        const d = this.getData();
        let location = '';

        if (d.hasResidence()) {
            const residence = d.getResidence();
            if (Util.isId(residence)) {
                const locDisplay = d.getResidenceDisplay();
                location = locDisplay.cityName || '';
            } else {
                location = residence;
            }
        }

        if (!_.isStringNotEmpty(location)) {
            location = 'Wohnsitz (Stadt)';
        }

        return (<span>{t('Lives in $(0)', location)}</span>);// eslint-disable-line
    }

    render() {
        const data = this.getData();
        if (!data) {
            return null;
        }

        let avatarStyle = {};
        let initials = '';
        if (data.hasAvatar()) {
            avatarStyle = {
                backgroundImage: `url(${data.getAvatarUrl()})`
            };
        } else {
            const firstName = data.getFirstName(); // || _.getValue(Meteor.user(), 'profile.firstName');
            const lastName = data.getLastName(); // || _.getValue(Meteor.user(), 'profile.lastName');
            initials = Util.getInitials(firstName, lastName);
        }

        return (
            <div className="block-stack">
                <PageDefaultBlock>
                    <ImageUser initials={initials} avatarStyle={avatarStyle} />
                    <div className="">
                        <div className="margin-top_x2">
                            <div
                                className="candidate-preview__name candidate-view__highlight-this"
                            >
                                {this.renderTitle()}
                            </div>
                            <div className="text_size_normal">
                                {t('Profile last updated: $(0)', data.getModificationDateFormatted('DD.MM.YYYY'))}
                            </div>
                        </div>
                        {
                            (this.props.displayLocation !== false && (data.hasResidence() || this.displayMissing()))
                            &&
                            <div>
                                <div className="margin-top text_size_normal">
                                    {this.renderLocation()}
                                </div>
                            </div>
                        }
                        {
                            this.getChildren()
                        }
                        {
                            this.showEditControls()
                            &&
                            <Link
                                to={this.getLink()}
                                className="candidate-view-list__button-add margin-top_x2"
                            >
                                <div className="candidate-view-list__button-add-label">
                                    <div className="candidate-view-list__button-icon_edit margin-right_x0p5" />
                                    Edit section
                                </div>
                            </Link>
                        }
                    </div>
                </PageDefaultBlock>
            </div>
        );
    }
}
