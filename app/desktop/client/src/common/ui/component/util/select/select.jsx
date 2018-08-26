import React, {Component} from 'react';
// import Checkbox from './component/checkbox/checkbox.jsx';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import latinize from 'latinize';
import Util from '../../../../lib/util/index.js';
import $ from 'jquery';

import EnumFactory from '../../../../lib/util/enum-factory/index.js';

export default class Select extends Component {

    constructor(props) {
        super(props);

        this._bounds = null;
        this._scrollPane = null;
        this._search = null;
        this._scope = null;
        this._cache = {};
        this._prevSearchValue = '';

        this.state = {
            opened: false,
            up: false,
            cursorAt: null,
            focused: false,
            ready: false,
        };

        this.onSearch = _.debounce(this.onSearch.bind(this), this.props.searchDebounce);
        this.onArrow = _.throttle(this.onArrow.bind(this), 120);
        this.onPage = _.throttle(this.onPage.bind(this), 120);

        this.onDropDownScroll = _.throttle(this.onDropDownScroll.bind(this), 100);

        this._options = this.props.options;
        if (_.isArray(this._options)) {
            this._options = this.makeEnum(this._options);
        }
    }

    componentDidMount() {
        this.onDocumentClick = this.onDocumentClick.bind(this);

        $(window.document).on('click', this.onDocumentClick);

        this.getOptions().pumpUpPart(this.getValueAsArray()).then(() => {
            this.setState({
                ready: true,
            });
        });
    }

    componentWillReceiveProps(props) {
        if ('options' in props) {
            if (_.isArray(props.options)) {
                this._options = this.makeEnum(props.options);
            } else if (props.options instanceof EnumFactory) {
                this._options = props.options;
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value && this.props.options instanceof EnumFactory) {
            this.getOptions().pumpUpPart(this.getValueAsArray()).then(() => {
                this.setState({
                    ready: true,
                });
            });
        }
    }

    componentWillUnmount() {
        $(window.document).off('click', this.onDocumentClick);
        this.unBindDropDownEvents();
    }

    makeEnum(options) {
        return new EnumFactory(options.map((x) => {
            return {
                ...x,
                key: x.key || x.value,
                value: x.label ? x.label : x.value
            };
        }));
    }

    bindDropDownEvents() {
        this.onWindowMetricChange = _.throttle(this.onWindowMetricChange.bind(this), 300);
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);

        $(window).on('scroll', this.onWindowMetricChange);
        $(window).on('resize', this.onWindowMetricChange);
        $(window.document).on('keydown', this.onDocumentKeyDown);
    }

    unBindDropDownEvents() {
        $(window).off('scroll', this.onWindowMetricChange);
        $(window).off('resize', this.onWindowMetricChange);
        $(window.document).off('keydown', this.onDocumentKeyDown);
    }

    onDocumentClick(e) {
        if (!this.props.closeOnOuterClick) {
            return;
        }

        let node = e.target;
        while (node) {
            if (node === this._scope || node === this._dropdown) {
                return;
            }

            node = node.parentElement;
        }

        // this.closeDropDown();
    }

    onWindowMetricChange() {
        this.updateDirection();
    }

    onDocumentKeyDown(e) {
        if (e.key === 'Escape') {
            this.closeDropDown();
        }
    }

    isReady() {
        return this.state.ready;
    }

    updateDirection() {
        if (!this._dropdown) {
            return;
        }

        const pos = this._dropdown.getBoundingClientRect();

        if (window.innerHeight > pos.height) {
            if (!this.isUp() && (pos.top + pos.height >= window.innerHeight)) {
                this.setUp();
            }

            if (this.isUp() && pos.top <= 0) {
                this.setDown();
            }
        }
    }

    isUp() {
        return this.state.up;
    }

    setUp() {
        if (Util.isMobile()) {
            return;
        }

        this.setState({
            up: true,
        });
    }

    setDown() {
        this.setState({
            up: false,
        });
    }

    isOpened() {
        return this.state.opened;
    }

    isFocused() {
        return this.state.focused;
    }

    isDisabled() {
        return !!this.props.disabled;
    }

    openDropDown(cb) {
        if (this.isDisabled()) {
            if (_.isFunction(cb)) {
                cb();
            }
            return;
        }

        if (!this.state.opened) {
            this.getOptions().pumpUp().then(() => {
                this.invalidateCache();
                if (this.missingValueAllowed() && this.isValueMissing(this.getNormalizedValue())) {
                    this.setSearchValue(this.getNormalizedValue());
                }
                this.setRenderRangeAround(this.getDisplayedOptions().getIndexByKey(this.getValueFirstOrSelectable()));

                this.setState({
                    opened: true,
                    up: false,
                }, () => {
                    this.bindDropDownEvents();
                    this.updateDirection();
                    this.seekCursor();
                    if (_.isFunction(cb)) {
                        cb();
                    }
                });
            }).catch((e) => {
                console.dir(e);
            });
        } else {
            if (_.isFunction(cb)) {
                cb();
            }
        }
    }

    closeDropDown() {
        if (this.state.opened) {
            this.cancelCloseDropDown();
            this.setState({
                opened: false,
            });
            this.unBindDropDownEvents();
            this.dropCursor();

            // here
            if (this.missingValueAllowed() && this._prevSearchValue !== '') {
                this.onAddNewClick(this._prevSearchValue);
            }
        }
    }

    /**
     * When we have some checkboxes inside the dropdown, we click on them and force the control to loose its focus,
     * and, therefore, the dropdown closes.
     * To prevent this, we delay the close action, and inside onFocus handler of the checkbox we bring the focus back
     * to the control.
     */
    closeDropDownDelayed() {
        if (this._preventClose) {
            this._preventClose = false;
            return;
        }

        this._closeTimeout = setTimeout(() => {
            this.closeDropDown();
        }, 250);
    }

    cancelCloseDropDown() {
        clearTimeout(this._closeTimeout);
        this._closeTimeout = null;
    }

    toggleDropDown() {
        if (this.state.opened) {
            if (!_.isStringNotEmpty(this.getSearchValue())) {
                this.closeDropDown();
                return true;
            }
        } else {
            this.openDropDown();
            return true;
        }

        return false;
    }

    getNodeByValue(value) {
        return $(`.selectbox__drop-down-item-id_${this.prepareId(value)}`, this.getScrollPane());
    }

    getValueFirstOrSelectable() {
        return this.getValueFirst() || this.getFirstSelectable();
    }

    seekCursor() {
        this.setCursorValue(this.getValueFirstOrSelectable());
    }

    scrollToValue(value, animated = false) {
        if (!this.getScrollPane()) {
            return;
        }

        const node = this.getNodeByValue(value);
        if (node.length) {
            const dd = $(this.getScrollPane());
            const pos = (node.position().top + dd.scrollTop()) - (Math.floor(dd.height() / 2) - Math.floor(node.height() / 2));
            if (animated) {
                $(this.getScrollPane()).animate({scrollTop: pos}, 100);
            } else {
                this.getScrollPane().scrollTop = pos;
            }
        }
    }

    onContainerClick() {
        if (!this.state.opened) {
            this.openDropDown(() => {
                this.focusSearch();
            });
        } else {
            this.closeDropDown();
        }
    }

    focusSearch() {
        if (this.isSearchAvailable()) {
            $(this._search).focus();
        }
    }

    getSearchValue() {
        if (!this.isSearchAvailable()) {
            return '';
        }

        return this._search.value;
    }

    setSearchValue(value) {
        this._search.value = value;
        this._prevSearchValue = value;
    }

    isSearchAvailable() {
        return (this.props.searchable && this._search);
    }

    isMultiple() {
        return !!this.props.multiple;
    }

    handleSingleMissing(value, key) {
        let newValue = {};

        if (this.missingValueAllowed()) {
            newValue = {value, key, item: null};
        }

        if (_.isFunction(this.props.onChangeAlt)) {
            this.props.onChangeAlt(newValue);
        }

        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(newValue);
        }

        if (_.isFunction(this.props.onOptionClick)) {
            this.props.onOptionClick(key);
        }
    }

    handleSingle(value, key) {
        let newValue = {};

        const item = this.getOptions().find((oItem) => {
            return oItem.key === key;
        });

        if (item) {
            newValue = {value, key, item};
        } else if (this.missingValueAllowed()) {
            newValue = {value, key, item: null};
        }

        if (_.isFunction(this.props.onChangeAlt)) {
            this.props.onChangeAlt(newValue);
        }

        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(newValue);
        }

        if (_.isFunction(this.props.onOptionClick)) {
            this.props.onOptionClick(key);
        }

        // forces to close option of the select box
        if (this.isSearchAvailable()) {
            this.setSearchValue('');
        }
        this.closeDropDown();
    }

    handleCheckBox(value, key) {
        const el = {value, key};
        let chosenArray = this.getOptions().getKeysValues().filter(e => _.contains(this.getValue(), e.key));
        chosenArray = chosenArray.map(x => x.key);

        const index = chosenArray.indexOf(key);
        if (index > -1) {
            chosenArray.splice(index, 1);
        } else {
            chosenArray.push(el.key);
        }

        if (_.isFunction(this.props.onChangeAlt)) {
            this.props.onChangeAlt(chosenArray);
        }

        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(chosenArray);
        }

        if (_.isFunction(this.props.onOptionClick)) {
            this.props.onOptionClick(key);
        }

        this.setCursorValue(key, false);
    }

    getPlaceHolder() {
        if (!this.isReady()) {
            return '';
        }

        let ph = this.props.placeholder || '';

        if (this.props.dynamicPlaceholder !== false) {
            const value = this.getNormalizedValue();
            let label = '';

            if (this.isMultiple()) {
                if (value.length) { // smth selected
                    const chosenArray = this.getOptions().filter(e => _.contains(value, e.key));
                    label = _.getValue(chosenArray, '[0].value');

                    if (value.length > 1 && label) {
                        ph = `${label} +${(value.length - 1)}`;
                    } else if (label) {
                        ph = label;
                    }
                }
            } else {
                // find value
                label = this.getOptions().getByKey(value);

                if (_.isObject(label) && _.isStringNotEmpty(label.value.toString())) {
                    ph = label.value;
                } else if (this.missingValueAllowed() && _.isStringNotEmpty(value)) {
                    ph = value;
                }
            }
        }

        if (_.isFunction(this.props.onRenderPlaceholder)) {
            ph = this.props.onRenderPlaceholder(ph, this.getValue());
        }

        return ph;
    }

    getHeight(el) {
        return el.getBoundingClientRect().height;
    }

    onDropDownWheel(e) {
        if (!this.getScrollPane()) {
            return;
        }

        // blocking scroll up
        if (e.deltaY < 0 && this.isScrollPaneTop()) {
            e.preventDefault();
        }

        // blocking scroll down
        if (e.deltaY > 0 && this.isScrollPaneBottom()) {
            e.preventDefault();
        }
    }

    onDropDownScroll() {
        if (this.isScrollPaneTop(50)) {
            this.expandTop().then(() => {
                this.expandRenderRangeFrom();
                this.forceUpdate();
            });
        }
        if (this.isScrollPaneBottom(50)) {
            this.expandBottom().then(() => {
                this.expandRenderRangeTo();
                this.forceUpdate();
            });
        }
    }

    onDropDownClick() {
        this._scope.focus();
    }

    onDropDownMouseDown() {
        this.cancelCloseDropDown();
        this._preventClose = true;
    }

    onDropDownMouseUp() {
        // on mobile shouldnt focus, otherwise opens the keyboard of the phone
        if (!Util.isMobile()) {
            this.focusSearch();
        }
    }

    onKeyUp() {
        if (!this.isReady()) {
            return;
        }

        if (this.isSearchAvailable()) {
            if (this.getSearchValue() !== this._prevSearchValue) {
                this.onSearch();
                this._prevSearchValue = this.getSearchValue();
            }
        }
    }

    onKeyDown(e) {
        if (!this.isReady()) {
            e.preventDefault();
            return;
        }

        const key = e.key;
        const code = e.keyCode;

        let processed = false;
        if (code === 32) {
            // we can open/close the dropdown by pressing space
            processed = this.toggleDropDown();
        } else if (key === 'Enter') {
            // we can choose values by pressing enter
            const cValue = this.getCursorValue();
            if (cValue) {
                if (this.isMultiple()) {
                    this.handleCheckBox('', cValue);
                } else {
                    this.handleSingle('', cValue);
                }
            }
            processed = true;
        } else if (key === 'ArrowUp' || key === 'ArrowDown') {
            // we can navigate up/down with arrow keys
            this.onArrow(key === 'ArrowUp');
            processed = true;
        } else if (key === 'PageUp' || key === 'PageDown') {
            // we can skip several items by pressing page up/down
            this.onPage(key === 'PageUp');
            processed = true;
        } else if (key === 'Home' || key === 'End') {
            // // go to the beginning/end of the list by pressing home/end
            // const pValue = key === 'Home' ? this.getFirstSelectable() : this.getLastSelectable();
            // if (pValue) {
            //     this.setCursorValue(pValue);
            // }
            //
            // processed = true;
        }

        if (processed) {
            e.preventDefault();
        }
    }

    onArrow(up) {
        const cValue = this.getCursorValue();
        const pValue = up ? this.getNextBefore(cValue) : this.getNextAfter(cValue);

        if (pValue) {
            this.setCursorValue(pValue, true, true);
        }
    }

    onPage(up) {
        const cValue = this.getCursorValue();
        const pValue = up ? this.getNextBefore(cValue, 5) : this.getNextAfter(cValue, 5);

        if (pValue) {
            this.setCursorValue(pValue, true, true);
        }
    }

    onSearch() {
        if (this.isOpened()) {
            this.reLoadOptions(this.getSearchValue()).then(() => {
                this.invalidateCache();
                this.forceUpdate();
                const items = this.getDisplayedOptions();
                if (items.getLength()) {
                    const value = items.getFirst().key;
                    this.setRenderRangeAround(items.getIndexByKey(value));
                    this.setCursorValue(value);
                }
            });
        }
    }

    onFocus() {
        this.cancelCloseDropDown();
        if (this.props.openOnFocus) {
            this.openDropDown();
        }

        this.setState({focused: true});
    }

    onBlur() {
        if (this.props.closeOnBlur) {
            this.closeDropDownDelayed();
        }

        if (this.isSearchAvailable()) {
            this._search.value = '';
        }

        this.setState({focused: false});
    }

    /**
     * Immediately bring focus to the dropdown, until it is closed
     */
    onCheckBoxFocus() {
        this._preventClose = true;
        this.cancelCloseDropDown();
        this.focusSearch();
    }

    onAddNewClick(search) {
        let value = this.getSearchValue();
        if (search !== undefined) {
            value = search;
        }

        if (!_.isStringNotEmpty(value)) {
            return;
        }

        if (!this.isMultiple()) {
            this.handleSingleMissing('', value);
        } else {
            // todo
        }
    }

    missingValueAllowed() {
        return this.props.allowMissingValue;
    }

    isValueMissing(value) {
        return !this.getOptions().hasKey(value);
    }

    getScrollPane() {
        return this._scrollPane || null;
    }

    isScrollPaneTop(eps = 0) {
        return this.getScrollPane().scrollTop <= eps;
    }

    isScrollPaneBottom(eps = 0) {
        return this.getScrollPane().scrollTop + this.getHeight(this.getScrollPane()) >= this.getHeight(this._bounds) - eps;
    }

    isValueSelected(value) {
        if (this.isMultiple()) {
            return this.getNormalizedValue().indexOf(value) >= 0;
        }

        return this.getNormalizedValue() === value;
    }

    isCursorAtValue(value) {
        return this.getCursorValue() === value;
    }

    getCursorValue() {
        return this.state.cursorAt;
    }

    dropCursor() {
        this.setState({
            cursorAt: null,
        });
    }

    setCursorValue(value, scroll = true, animate = false) {
        if (!value) {
            return;
        }

        this.setState({
            cursorAt: value,
        }, () => {
            if (scroll) {
                this.scrollToValue(value, animate);
            }
        });
    }

    getValue() {
        return this.props.value || [];
    }

    getNormalizedValue() {
        let value = this.getValue();
        if (this.isMultiple()) {
            value = _.isArray(value) ? value : [];
        } else {
            if (!_.isExist(value)) {
                value = '';
            }
        }

        if (_.isFunction(this.props.onInternalizeValue)) {
            value = this.props.onInternalizeValue(value);
        }

        return value;
    }

    getValueAsArray() {
        const v = this.getValue();

        if (!_.isArray(v)) {
            return [v];
        } else {
            return v;
        }
    }

    getValueFirst() {
        const v = this.getNormalizedValue();

        if (_.isArray(v)) {
            return v.length ? v[0] : null;
        }

        return v;
    }

    prepareId(value) {
        // todo: replace replace() with hash()
        return value.toString().trim().toLowerCase().replace(/[^a-z0-9-_]+/ig, '-');
    }

    getOptions() {
        return this._options;
    }

    getOptionByValue(value) {
        if (!this._cache.index) {
            this._cache.index = this.getOptions().reduce((result, item) => {
                result[item.value] = item;
                return result;
            }, {});
        }

        return this._cache.index[value];
    }

    async reLoadOptions(search) {
        if (this._options && _.isFunction(this._options.load)) {
            this._options.purge();
            await this._options.load(search);
        }
    }

    async expandTop() {
        if (this._options && _.isFunction(this._options.load)) {
            const search = this.getSearchValue();
            if (_.isStringNotEmpty(search)) {
                await this._options.load(search, true);
            }
        }
    }

    async expandBottom() {
        if (this._options && _.isFunction(this._options.load)) {
            const search = this.getSearchValue();
            if (_.isStringNotEmpty(search)) {
                await this._options.load(search);
            }
        }
    }

    getDisplayedOptions() {
        if (!this._cache.displayed) {
            let all = this.getOptions().filter((item) => {
                return item.enabled !== false;
            }, true);

            // todo: this should be moved to the data provider
            if (this.props.localSearch) {
                let sValue = this.getSearchValue();
                if (_.isStringNotEmpty(sValue)) {
                    // exclude non-selectable options
                    sValue = this.prepareValue(sValue);

                    sValue = sValue.split(/\s+/).map((sItem) => {
                        return sItem.trim();
                    }).filter(x => !!x);

                    const rank = all.map((item) => {
                        const value = this.prepareValue(item.value);
                        return {
                            w: this.makeRelevancy(value, sValue),
                            i: item,
                        };
                    }).filter(x => x.w > 0);

                    rank.sort((a, b) => {
                        if (a.w > b.w) return -1;
                        if (a.w < b.w) return 1;
                        return 0;
                    });

                    all = rank.map((item) => {
                        return item.i;
                    });
                }
            }

            this._cache.displayed = this.getOptions().make(all);
        }

        return this._cache.displayed;
    }

    prepareValue(value) {
        if (!_.isStringNotEmpty(value)) {
            return value;
        }
        return latinize(value).toLowerCase().replace(/[()]/g, '');
    }

    makeRelevancy(value, sValue) {
        if (_.difference(sValue, value.split(/\s+/)).length === 0) {
            return 2;
        }

        let match = true;
        sValue.forEach((sItem) => {
            if (!match) {
                return;
            }
            if (value.indexOf(sItem) < 0) {
                match = false;
            }
        });

        return match ? 1 : 0;
    }

    // this happens only on search o popup open
    invalidateCache() {
        this._cache = {
            renderRange: {},
        };
    }

    getRenderRange() {
        return this._cache.renderRange;
    }

    setRenderRangeAround(ix) {
        this._cache.renderRange = {from: ix - 10, to: ix + 10};
    }

    expandRenderRangeTo() {
        this._cache.renderRange.to += 10;
    }

    expandRenderRangeFrom() {
        const r = this._cache.renderRange;
        if (r.from > 0) {
            r.from -= 10;
        }
    }

    getValues() {
        if (!this._cache.values) {
            this._cache.values = this.getOptions().getValues();
        }

        return this._cache.values;
    }

    getDisplayedValues() {
        if (!this._cache.values) {
            this._cache.values = this.getDisplayedOptions().keys;
        }

        return this._cache.values;
    }

    getDisplayedSelectableValues() {
        if (!this._cache.sValues) {
            this._cache.sValues = this.getDisplayedOptions().filter((item) => {
                return item && item.selectable !== false;
            }, true).map(x => x.key);
        }

        return this._cache.sValues;
    }

    getLength() {
        return this.getDisplayedValues().length;
    }

    getNextAfter(value, distance = 1) {
        const values = this.getDisplayedSelectableValues();
        const i = values.indexOf(value);
        const len = values.length;
        if (i >= 0 && i + 1 < len) {
            // we have space to move, go as far as we can
            let nI = i + distance;
            if (nI >= len) {
                nI = len - 1;
            }

            return values[nI];
        }

        return null;
    }

    getNextBefore(value, distance = 1) {
        const values = this.getDisplayedSelectableValues();
        const i = values.indexOf(value);
        if (i > 0) {
            // we have space to move, go as far as we can
            let nI = i - distance;
            if (nI < 0) {
                nI = 0;
            }

            return values[nI];
        }

        return null;
    }

    getFirst() {
        return this.getDisplayedValues()[0];
    }

    getFirstSelectable() {
        return this.getDisplayedSelectableValues()[0];
    }

    getLast() {
        return this.getDisplayedValues()[this.getLength() - 1];
    }

    getLastSelectable() {
        const values = this.getDisplayedSelectableValues();
        return values[values.length - 1];
    }

    wrapListItem(el) {
        if (_.isFunction(this.props.onRenderListItem)) {
            return this.props.onRenderListItem(el);
        }

        return el.value;
    }

    renderClassName() {
        return `hack__controls-deface selectbox ${!this.isOpened() ? 'selectbox_closed' : 'selectbox_opened'} ${this.isFocused() ? 'selectbox_focused' : ''} selectbox_adaptive ${this.isDisabled() ? 'selectbox_disabled' : ''} ${this.props.className}`;
    }

    renderArrow() {
        if (_.isFunction(this.props.onRenderArrow)) {
            return this.props.onRenderArrow();
        }

        if (this.missingValueAllowed()) {
            return '';
        }

        return (
            <div className="selectbox__placeholder-arrow" />
        );
    }

    render() {
        const className = classnames('selectbox__area', {
            'selectbox__area_mode-transparent hover-menu': !!this.props.transparent,
            'selectbox__area_mode-input': this.missingValueAllowed(),
        });

        const options = this.getDisplayedOptions();
        const value = this.getNormalizedValue();
        const phClass = classnames('selectbox__placeholder', {
            'selectbox__placeholder_no-value': this.missingValueAllowed() && !_.isStringNotEmpty(value),
        });

        return (
            <div className={this.renderClassName()}>
                <div
                    className={className}
                    ref={(ref) => { this._scope = ref; }}
                >
                    <div
                        onClick={this.onContainerClick.bind(this)}
                        className="rb-relative"
                    >
                        {
                            (!this.isOpened() || !this.props.searchable)
                            &&
                            <div
                                className={phClass}
                            >
                                {this.getPlaceHolder()}&nbsp;
                                {this.renderArrow()}
                            </div>
                        }
                        <input
                            // onChange={event => _.isFunction(this.props.onChange) && this.props.onChange(event.target)}
                            ref={(ref) => { this._search = ref; }}
                            type="text"
                            className="selectbox__search-input"
                            onFocus={this.onFocus.bind(this)}
                            onBlur={this.onBlur.bind(this)}
                            onKeyDown={this.onKeyDown.bind(this)}
                            onKeyUp={this.onKeyUp.bind(this)}
                            disabled={this.isDisabled()}
                        />
                    </div>
                </div>
                {
                    (options.isNotEmpty() || this.missingValueAllowed())
                    &&
                    <div
                        className={`selectbox__drop-down ${this.isUp() ? 'selectbox__drop-down_up' : ''} ${!this.isOpened() ? 'display-none' : ''}`}
                        ref={(ref) => { this._dropdown = ref; }}
                    >
                        <div className="selectbox__drop-down-inner">
                            {
                                options.isNotEmpty()
                                &&
                                <div
                                    className="selectbox__scroll-pane selectbox__drop-down-part"
                                    ref={(ref) => { this._scrollPane = ref; }}
                                    onWheel={this.onDropDownWheel.bind(this)}
                                    onClick={this.onDropDownClick.bind(this)}
                                    onMouseDown={this.onDropDownMouseDown.bind(this)}
                                    onMouseUp={this.onDropDownMouseUp.bind(this)}
                                    onScroll={this.onDropDownScroll.bind(this)}
                                    tabIndex="-1" // due to some strange reason FF puts focus on this div when pressing tab button
                                >
                                    <div
                                        className="selectbox__scroll-pane-scope"
                                        ref={(ref) => { this._bounds = ref; }}
                                    >
                                        {
                                            options.getSubRange(this.getRenderRange()).map((el) => {
                                                if (el.key !== null && el.enabled !== false) {
                                                    if (this.isMultiple()) {
                                                        // todo: handle unselectable
                                                        // todo: multiple selector currently unsupported
                                                        return null;
                                                        // return (<Checkbox
                                                        //     label={el.value}
                                                        //     value={el.key}
                                                        //     options={el.options}
                                                        //     key={el.value}
                                                        //     check={_.contains(value, el.key)}
                                                        //     handleCheckboxChange={this.handleCheckBox.bind(this)}
                                                        //     onFocus={this.onCheckBoxFocus.bind(this)}
                                                        //     cursor={this.isCursorAtValue(el.key)}
                                                        //     className={`selectbox__drop-down-item-id_${this.prepareId(el.key)}`}
                                                        //     skipNavigation
                                                        // />);
                                                    } else {
                                                        if (el.selectable === false) {
                                                            return (
                                                                <label
                                                                    className="selectbox__drop-down-item selectbox__hide-input"
                                                                    key={el.key}
                                                                >
                                                                    <div className="selectbox__drop-down-item-text">
                                                                        {this.wrapListItem(el)}
                                                                    </div>
                                                                </label>
                                                            );
                                                        } else {
                                                            return (
                                                                <label
                                                                    className={`selectbox__drop-down-item selectbox__drop-down-item_selectable selectbox__hide-input selectbox__drop-down-item-id_${this.prepareValue(el.key)} ${this.isCursorAtValue(el.key) ? 'selectbox__drop-down-item_cursor' : ''}`}
                                                                    key={el.key}
                                                                    title={el.value}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={this.handleSingle.bind(this, el.value, el.key)}
                                                                        checked={value === el.key}
                                                                        name={this.props.name}
                                                                        value={el.key}
                                                                    />
                                                                    <div className="selectbox__drop-down-item-text">
                                                                        {this.wrapListItem(el)}
                                                                    </div>
                                                                </label>
                                                            );
                                                        }
                                                    }
                                                }

                                                return null;
                                            })
                                        }
                                    </div>
                                </div>
                            }
                            {
                                (this.missingValueAllowed())
                                &&
                                <div
                                    className="selectbox__drop-down-part selectbox__drop-down-item-new"
                                    onClick={this.onAddNewClick.bind(this)}
                                >
                                    <div className="selectbox__drop-down-item-new-label">
                                        {this.props.addMissingText}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

Select.propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]), // eslint-disable-line // enum
    onOptionClick: PropTypes.func,
    onRenderListItem: PropTypes.func,
    onRenderPlaceholder: PropTypes.func,
    onChange: PropTypes.func,
    multiple: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]), // eslint-disable-line
    searchDebounce: PropTypes.number,
    localSearch: PropTypes.bool, // todo: this should be moved to the data provider

    openOnFocus: PropTypes.bool,
    closeOnBlur: PropTypes.bool,
    closeOnOuterClick: PropTypes.bool,

    onInternalizeValue: PropTypes.func, // todo: replace with .compareKey() callback, in case we have objects in keys

    searchable: PropTypes.bool,
    disabled: PropTypes.bool,
    allowMissingValue: PropTypes.bool,
    addMissingText: PropTypes.string,

    onRenderArrow: PropTypes.func,
};

Select.defaultProps = {
    placeholder: '',
    name: '',
    options: [],
    onOptionClick: null,
    onRenderListItem: null,
    onRenderPlaceholder: null,
    onChange: null,
    multiple: true,
    value: [],
    searchDebounce: 200,
    localSearch: true,

    openOnFocus: false,
    closeOnBlur: true,
    closeOnOuterClick: true,

    onInternalizeValue: null,

    searchable: true,
    disabled: false,
    allowMissingValue: false,
    addMissingText: 'Add new item',

    onRenderArrow: null,
};
