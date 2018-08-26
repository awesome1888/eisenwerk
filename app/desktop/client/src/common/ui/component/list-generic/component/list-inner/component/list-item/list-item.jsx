import React from 'react';
import BaseComponent from '../../../../../../../lib/ui/component/index.jsx';
import Util from '../../../../../../../lib/util/index.js';
import PlaceHolder from './component/list-item-placeholder/list-item-placeholder.jsx';

export default class ListItem extends BaseComponent {

    getItemData() {
        return this.props.data || {};
    }

    getId() {
        const item = this.getItemData();
        if (_.isObjectNotEmpty(item) && _.isStringNotEmpty(item._id)) {
            return item._id;
        } else if (_.isFunction(item.getId)) {
            return item.getId();
        }

        return null;
    }

    /**
     * Returns detail page url parameter value, if it was passed to the component
     * @returns {string}
     */
    getDetailPageUrlTemplate() {
        let template = this.props.detailPageUrl;
        if (_.isString(template)) {
            template = template.trim();
            if (template.length) {
                return template;
            }
        }

        return '';
    }

    /**
     * Replaces the #ID# placeholder in detail page url, and optionally attaches the current url
     * as a back url.
     * @param id
     * @param addBackUrl
     * @returns {*}
     */
    getDetailPageUrl(id, addBackUrl = false) {
        const template = this.getDetailPageUrlTemplate();
        if (template.length) {
            let url = template.replace(/#ID#/g, id);
            if (addBackUrl) {
                url = Util.getBackPath(url);
            }

            return url;
        }
        return null;
    }

    isReady() {
        return !!this.props.ready;
    }

    getPlaceholderParameters() {
        return {};
    }

    renderPlaceholder() {
        return (<PlaceHolder {...this.getPlaceholderParameters()} />);
    }

    onDelete() {
        if (_.isFunction(this.props.onDelete)) {
            this.props.onDelete(this.getId());
        }
    }

    onDeactivate() {
        if (_.isFunction(this.props.onDeactivate)) {
            this.props.onDeactivate(this.getId());
        }
    }

    onActivate() {
        if (_.isFunction(this.props.onActivate)) {
            this.props.onActivate(this.getId());
        }
    }

    getOptions() {
        return [];
    }

    render() {
        if (!this.isReady()) {
            return (this.renderPlaceholder());
        }

        return (
            <div className="data-block">
                <div className="data-block__content">
                    {
                        _.map(this.props.data, (item, key) => {
                            if (_.isObject(item) || _.isArray(item)) {
                                return null;
                            }

                            return (
                                <div className="" key={key}>
                                    {key}: {item}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
