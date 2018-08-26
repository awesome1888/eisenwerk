import React from 'react';
import BaseComponent from '../../../../../lib/ui/component/index.jsx';
import { Link } from 'react-router-dom';

import './style.less';

export default class List extends BaseComponent {

    getData() {
        return this.props.data || [];
    }

    getMarkerClass(item) {
        if (_.isStringNotEmpty(item.markerClassName)) {
            return item.markerClassName;
        }

        if (_.isStringNotEmpty(this.props.markerClassName)) {
            return this.props.markerClassName;
        }

        return 'icon_bookmark';
    }

    isMultiple() {
        if (!('multiple' in this.props)) {
            return true;
        }
        return !!this.props.multiple;
    }

    getPathTemplate() {
        return this.props.pathTemplate || '/profile/:section/:item';
    }

    getCode() {
        return this.props.code || 'none';
    }

    makeLink(i, item) {
        return this.getPathTemplate().replace(':item', _.isStringNotEmpty(item._id) ? item._id : i).replace(':section', this.getCode());
    }

    hasAddNewHandler() {
        return _.isFunction(this.props.onAddNewClick);
    }

    isEditSection() {
        return this.props.type === 'edit';
    }

    isTitle(item) {
        return item.type === 'title';
    }

    getButtonText() {
        let text = t('Add new element');

        if (this.isEditSection()) {
            text = t('Edit section');
        }

        return text;
    }

    getButtonIcon() {
        let icon = 'add';

        if (this.isEditSection()) {
            icon = 'edit';
        }

        return icon;
    }

    render() {
        const data = this.getData();
        let i = 0;
        const isEditSection = this.isEditSection();

        return (
            <div className="">
                {
                    _.isArrayNotEmpty(data)
                    &&
                    <div className={`rb-padding-b_x2 ${isEditSection ? 'rb-group_x' : 'rb-group_x2'}`}>
                        {
                            data.map((item) => {
                                const isTitle = this.isTitle(item.item);

                                return (
                                    <div className={item.item.className} key={i++}>
                                        {
                                            isTitle
                                            &&
                                            <div className="candidate-view-list__title">
                                                {item.ui}
                                            </div>
                                        }
                                        {
                                            (this.isEditSection() && !isTitle)
                                            &&
                                            <div className="candidate-view-list__item" data-save-scroll="true">
                                                <div className={`candidate-view-list__icon ${this.getMarkerClass(item.item)} candidate-view__highlight-this`} />
                                                <div className="icon-label__content">
                                                    {item.ui}
                                                </div>
                                            </div>
                                        }
                                        {
                                            (!this.isEditSection() && !isTitle)
                                            &&
                                            <Link className="candidate-view-list__item" to={this.makeLink(i, item.item)} data-save-scroll="true">
                                                <div className={`candidate-view-list__icon ${this.getMarkerClass(item.item)} candidate-view__highlight-this`} />
                                                <div className="icon-label__content">
                                                    {item.ui}
                                                </div>
                                            </Link>
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                }
                {
                    (this.isMultiple() || !_.isArrayNotEmpty(data))
                    &&
                    <div className="">
                        <Link
                            to={this.hasAddNewHandler() ? '' : this.makeLink('new', {})}
                            onClick={this.props.onAddNewClick}
                            className="candidate-view-list__button-add"
                            data-save-scroll="true"
                        >
                            <div className="candidate-view-list__button-add-label">
                                <div className={`candidate-view-list__button-icon_${this.getButtonIcon()}`} /> {this.getButtonText()}
                            </div>
                        </Link>
                    </div>
                }
            </div>
        );
    }
}
