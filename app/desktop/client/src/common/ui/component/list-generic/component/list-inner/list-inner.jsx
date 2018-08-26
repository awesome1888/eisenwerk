import React, { Component } from 'react';
import NothingFound from '../../../nothing-found/nothing-found.jsx';
import ListItem from './component/list-item/list-item.jsx';

export default class ListInner extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getListItemComponentClass() {
        if (this.props.itemClass) {
            // trying to use a short-cut
            return this.props.itemClass;
        }
        return ListItem;
    }

    mapItemParameters(parameters) {
        if (_.isFunction(this.props.itemParametersMapper)) {
            return this.props.itemParametersMapper(parameters);
        }
        return parameters;
    }

    postProcessData(data) {
        return data;
    }

    renderListItem(parameters = {}) {
        const key = parameters.key;
        parameters = this.mapItemParameters(parameters);
        parameters.key = key; // keep the key from being redefined
        parameters.backUrl = this.props.backUrl; // set backurl

        return React.createElement(
            this.getListItemComponentClass(parameters),
            parameters
        );
    }

    renderItems() {
        return (
            <div className={`data-block ${this.props.className || ''}`}>
                {this.renderItemsList()}
            </div>
        );
    }

    renderItemsList() {
        if (!this.isReady()) {
            const result = [];
            // create 10 pseudo-items to display "placeholders"
            for (let k = 0; k < 10; k++) {
                result.push(
                    this.renderListItem({
                        index: k,
                        key: k,
                        data: {},
                        ready: false,
                    })
                );
            }

            return result;
        }

        return (
            this.postProcessData(this.props.data).map((item, index) => {
                return this.renderListItem({
                    index,
                    key: item.getId(),
                    data: item,
                    onListUpdate: this.props.onListUpdate,
                    ready: true,
                    onDelete: this.props.onDelete,
                    onDeactivate: this.props.onDeactivate,
                    onActivate: this.props.onActivate,
                });
            })
        );
    }

    isReady() {
        return !!this.props.ready;
    }

    getData() {
        return this.props.data || [];
    }

    render() {
        if (this.isReady() && !_.isArrayNotEmpty(this.getData())) {
            return (
                <NothingFound
                    showFilterButton
                    // buttonLink={this.props.nothingFoundButtonLink}
                    // buttonLink={this.props.nothingFoundButtonLink}
                    onButtonClick={this.props.onNothingFoundButtonClick}
                />
            );
        }

        return this.renderItems();
    }
}
