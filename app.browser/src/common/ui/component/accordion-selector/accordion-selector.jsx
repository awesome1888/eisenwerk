import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.less';

export default class Select extends Component {

    static propTypes = {
        name: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            label: PropTypes.string,
        })),
        onOptionClick: PropTypes.func,
        onChange: PropTypes.func,
        value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]), // eslint-disable-line,
        allowSelectAll: PropTypes.bool
    };

    static defaultProps = {
        name: '',
        options: [],
        onOptionClick: null,
        onChange: null,
        value: [],
        multiple: true,
        allowSelectAll: true,
        allowSearch: false
    };

    constructor(props) {
        super(props);
        this.state = {
            opened: [],
            selected: this.calcSelected(props),
            searchValue: '',
        };
    }

    componentWillReceiveProps(props) {
        if (props.value !== this.state.selected) {
            this.setState({
                selected: this.calcSelected(props)
            });
        }
    }

    calcSelected(props) {
        if (props.value) {
            return props.value;
        } else {
            return [];
        }
    }

    getOptions() {
        if (!this._options) {
            this._options = this.getNormalizedOptions();
        }
        return this._options;
    }

    isSelected(value) {
        return (this.state.selected.length && this.state.selected.indexOf(value) > -1);
    }

    isSelectedAll(items) {
        const itemKeys = _.pluck(items, 'key');
        const selected = _.intersection(itemKeys, this.getSelected());
        return selected.length === itemKeys.length;
    }

    getSelected() {
        return this.state.selected || [];
    }

    setSelected(value) {
        this.setState({
            selected: value
        });

        if (_.isFunction(this.props.onChange)) {

            this.props.onChange(value);
        }
    }

    isOpened(value) {
        return this.state.opened.indexOf(value) > -1;
    }

    setOpened(value) {
        value = _.uniq(value);
        this.setState({
            opened: value
        });
    }

    allowSearch() {
        return this.props.allowSearch;
    }

    onParentClick(value) {
        const openedItems = _.clone(this.state.opened);
        const index = openedItems.indexOf(value);
        if (index > -1) {
            openedItems.splice(index, 1);
        } else {
            openedItems.push(value);
        }

        this.setOpened(openedItems);
    }

    onItemClick(value) {
        let selectedValues = this.getSelected();
        const index = selectedValues.indexOf(value);
        if (index > -1) {
            selectedValues.splice(index, 1);
        } else {
            if (this.props.multiple) {
                selectedValues.push(value);
            } else {
                selectedValues = [value];
            }
        }

        this.setSelected(selectedValues);
    }

    onItemAllClick(items, deselect) {
        let selected = this.getSelected();
        const itemKeys = _.pluck(items, 'key');
        if (deselect) {
            selected = _.difference(selected, itemKeys);
        } else {
            selected = _.union(selected, itemKeys);
        }
        this.setSelected(selected);
    }

    getNormalizedOptions() {
        const options = _.deepClone(this.props.options);
        let normalizedOptions = [];
        const openedValues = [];
        const needSearch = (this.allowSearch() && this.state.searchValue.length > 0);

        const groups = _.filter(options, (item) => { return item.parent === true; });
        if (groups.length) {
            groups.forEach((group) => {
                group.items = [];

                let show = true;
                if (needSearch) {
                    show = false;

                    if (group.value.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) > -1) {
                        show = true;
                    }
                }

                options.forEach((item) => {
                    if (item.parentKey === group.key) {
                        if (needSearch && item.value.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) < 0) {
                            return;
                        } else {
                            show = true;
                        }

                        group.items.push(item);

                        if (this.isSelected(item.key)) {
                            openedValues.push(group.key);
                        }
                    }
                });

                if (!show) {
                    return;
                }

                if (group.items.length === 1) {
                    const item = group.items[0];
                    group = {
                        key: item.key,
                        value: item.value,
                        selectable: true,
                        items: []
                    };
                }
                if (group.selectable !== false || group.items.length > 0) {
                    normalizedOptions.push(group);
                }
            });
        } else {
            normalizedOptions = _.filter(options, (item) => {
                item.selectable = true;
                return (!needSearch || item.value.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) >= 0);
            });
        }
        this.setOpened(openedValues);

        return normalizedOptions;
    }

    getInnerListHeight(length) {
        return 53 * length;
    }

    renderItemAll(el) {
        const allSelected = this.isSelectedAll(el.items);
        const className = classnames({
            'list-accordion__inner-item': true,
            'list-accordion__inner-item_selected': allSelected
        });
        return (
            <li key={`${el.key}_all`} className={className} onClick={this.onItemAllClick.bind(this, el.items, allSelected)}>
                <div className="list-accordion__inner-item-label">
                    Alle auswählen
                </div>
            </li>
        );
    }

    getSearchFieldValue() {
        return this[`form-${this.props.name}`].value;
    }

    onSearchChangeHandle(e) {
        const searchValue = this.getSearchFieldValue();
        this.setState({
            searchValue
        }, () => {
            this._options = false;
            this.forceUpdate();
        });
    }

    renderOptions(options) {
        return (
            <ul className="list-accordion">
                {
                    options.map((el) => {
                        const isSelected = this.isSelected(el.key) || this.isOpened(el.key);
                        const elClassName = classnames({
                            'list-accordion__item': true,
                            'list-accordion__item_selected': isSelected
                        });
                        const innerStyle = {};
                        if (isSelected && _.isArrayNotEmpty(el.items)) {
                            innerStyle.maxHeight = this.getInnerListHeight(el.items.length + 1); // temporary solution
                        }
                        return (
                            <li key={el.key} className={elClassName}>
                                {
                                    !el.selectable
                                    &&
                                    <div className="list-accordion__item-label" onClick={this.onParentClick.bind(this, el.key)}>
                                        {el.value}
                                    </div>
                                }
                                {
                                    el.selectable
                                    &&
                                    <div className="list-accordion__item-label" onClick={this.onItemClick.bind(this, el.key)}>
                                        {el.value}
                                    </div>
                                }
                                {
                                    _.isArray(el.items) && el.items.length > 1
                                    &&
                                    <ul className="list-accordion__inner" style={innerStyle}>
                                        {
                                            this.props.allowSelectAll
                                            &&
                                            this.renderItemAll(el)
                                        }
                                        {
                                            el.items.map((item) => {
                                                const itemClassName = classnames({
                                                    'list-accordion__inner-item': true,
                                                    'list-accordion__inner-item_selected': this.isSelected(item.key)
                                                });
                                                return (
                                                    <li key={item.key} className={itemClassName} onClick={this.onItemClick.bind(this, item.key)}>
                                                        <div className="list-accordion__inner-item-label">
                                                            {item.value}
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                }
                            </li>
                        );
                    })
                }
            </ul>
        );
    }

    render() {
        const options = this.getOptions();

        return (
            <div>
                {
                    this.allowSearch()
                    &&
                    <div className="list-accordion__search">
                        <input
                            className="list-accordion__search-input"
                            type="text"
                            onChange={this.onSearchChangeHandle.bind(this)}
                            ref={(c) => { this[`form-${this.props.name}`] = c; }}
                            placeholder={t('Search')}
                        />
                    </div>
                }
                {
                    options.length > 0
                    &&
                    this.renderOptions(options)
                }
                {
                    !options.length
                    &&
                    <div className="list-accordion__search-nothing-found">
                        {t('No results')}
                    </div>
                }
            </div>
        );
    }
}
