import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layout.page.one-column/index.jsx';

import Paginator from '../paginator/paginator.jsx';
import ListInner from './component/list-inner/list-inner.jsx';
import BaseComponent from '../../../lib/ui/component/index.jsx';
import BarFilterTypes from '../filter/bar-filter/enum/bar-filter-type.enum.js';
import PageScroll from '../../../lib/util/page-scroll/page-scroll.js';
import BarFilter from '../filter/bar-filter/bar-filter.jsx';
import Util from '../../../lib/util/index.js';
import CSVExporter from '../../../lib/util/csv-exporter/index.js';
import SelectCompact from '../util/select-compact/select-compact.jsx';
import ConfirmModal from '../confirm-modal/confirm-modal.jsx';
import Modal from '../modal/modal-controller.js';

import { Link } from 'react-router-dom';
import {GatewayDest} from 'react-gateway';

import './style.less';

/**
 * The basic component for making lists
 * @abstract
 */
export default class ListGeneric extends BaseComponent {

    static propTypes = {
        className: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object,
        ]),
        allowScrollToStored: PropTypes.bool,
    };

    static defaultProps = {
        className: '',
        allowScrollToStored: true,
    };

    _scrolled = false;
    _resetReadyTimer = null;
    _ongoingReadyState = {};
    _cache = {
        query: null,
        counterQuery: null,
    }; // eslint-disable-line react/sort-comp

    constructor(params) {
        super(params);
        const url = this.loadFiltersFromURL();
        this.extendState(Object.assign({
            page: this.queryPage,
            perPage: this.queryPageSize,
            chosenFilters: url,
            sort: this.extractSortFromUrl(url)
        }, this.getInitialDataState()));

        this.url = null;
    }

    componentWillMount() {
        this._scrolled = false;
    }

    componentDidMount() {
        this.startDataReload();
    }

    componentDidUpdate() {
        this.scrollIfReady();
    }

    // componentWillUnmount() {
    //     const q = this.getQueryCached();
    //     if (q) {
    //         q.unsubscribe();
    //     }
    // }

    // Basic methods usually need to be overridden

    getEntity() {
        throw new Error('Not implemented');
    }
    /**
     * Returns link to the query instance, which execution result we want to display
     * in the list. Use it to specify the exact query to call.
     * @abstract
     * @access protected
     */
    getQueryInstance() {
        throw new Error('Not implemented');
    }

    /**
     * Feel free to override this declaration
     * @returns {*}
     */
    getExportQueryInstance() {
        return this.getQueryInstance();
    }

    /**
     * Filter settings hook, use it to provide filter settings
     * @returns {{}}
     */
    getFilterSettings() {
        return {};
    }

    /**
     * Returns the page size for the page navigator
     * @returns {number}
     * @access protected
     */
    getPageSize() {
        return this.state.perPage;
    }

    /**
     * Returns link to the inner list component class, use it to provide a custom one
     * @returns {ListInner}
     * @access protected
     */
    getListContainerClass() {
        return ListInner;
    }

    /**
     * Just a short-cut to .getListContainerClass().getListItemComponentClass()
     */
    getListItemComponentClass() {
        return null;
    }

    getItemParametersMapper() {
        return null;
    }

    /**
     * Returns query parameters. It can be async in implementations, for example, if
     * we need to get some remote criteria asynchronously before building the list
     * @returns {Promise.<{}>}
     * @access protected
     */
    async getQueryParameters() {
        return {
        };
    }

    /**
     * Allow changes on items retrieved from db. It can be async in implementations, for example, if
     * we need to get some remote criteria asynchronously before building the list
     * @returns {Promise.<{}>}
     * @access protected
     */
    async treatRetrievedData(items) {
        return items;
    }

    /**
     * Wrapper for csv export, in case you want to implement some custom logic on export
     * @returns {Promise.<{}>}
     */
    async getQueryParametersCSVExport() {
        return this.getQueryParameters();
    }

    /**
     * Main routine that starts after the component get mounted
     * or every time the component get updated
     * @returns void
     * @access protected
     */
    startDataReload() {
        this.getQuery().then(() => {
            this.reLoadData();
        });
    }

    /**
     * The content of startDataReload, outside the promise wrapper
     * @returns void
     * @access protected
     */
    reLoadData() {
        this.setResetReadyTimeout();

        this.loadItems();
    }

    getInitialDataState() {
        return {
            total: 0,
            items: [],

            countReady: false,
            itemsReady: false,
        };
    }

    resetReady() {
        this.setState(this.getInitialDataState());
    }

    setReadyState(delta, callback = null) {
        if (this._resetReadyTimer) {
            Object.assign(this._ongoingReadyState, delta);
            if (callback) {
                callback();
            }
        } else {
            this.setState(delta, callback);
        }

        if (this.isReady(true)) {
            this.clearResetReadyTimeout();
            this.updateActualReadyState();
        }
    }

    updateActualReadyState() {
        this.setState(this._ongoingReadyState);
        this._ongoingReadyState = {};
    }

    // setState(delta, callback) {
    //     if (this._resetReadyTimer === null) {
    //         return super.setState(delta, callback);
    //     } else {
    //         return super.setState(delta, () => {
    //             if (this.isReady(true)) {
    //                 // console.dir('Timer cancelled');
    //
    //                 console.dir('it is ready. cancel and update');
    //                 this.clearResetReadyTimeout();
    //                 this.updateActualReadyState();
    //             }
    //             if (callback) {
    //                 callback();
    //             }
    //         });
    //     }
    // }

    /**
     * Returns true if all data were loaded
     * @returns {boolean}
     * @access protected
     */
    isReady(ongoing = false) {
        let s = this.state;
        if (ongoing) {
            s = this._ongoingReadyState;
        }

        return this.evalReadyCondition(s);
    }

    evalReadyCondition(s) {
        return !!(
            this.getQueryCached() // we loaded async query params and created the query
            &&
            s.countReady // we loaded count
            &&
            s.itemsReady // we loaded items
        );
    }

    setResetReadyTimeout() {
        if (this._resetReadyTimer) {
            // already started somewhere above
            return;
        }

        // console.dir('Timer start');
        this._resetReadyTimer = setTimeout(() => {
            // console.dir('Reset state, fill from ongoing');
            this._resetReadyTimer = null;

            // clearing ready state
            this.resetReady();

            // after reset, we need to copy all data already obtained to the actual state
            // console.dir('timeout ened, update');
            this.updateActualReadyState();
        }, 500);
    }

    clearResetReadyTimeout() {
        clearTimeout(this._resetReadyTimer);
        this._resetReadyTimer = null;
    }

    /**
     * This function disable a double query when the page is changed.
     * Some pages query on other functions (eg componentWillReceiveProps)
     */
    onPageChangeQuery() {
        return true;
    }

    /**
     * Updates list when page changes
     * @param {Number} page
     * @returns void
     * @access protected
     */
    onPageChange(page) {
        if (page !== this.state.page) {
            this.queryPage = page;
            this.queryPageSize = this.getPageSizeForUrl();
            this.setState({
                page,
            }, () => {
                if (this.onPageChangeQuery()) {
                    this.loadItems();
                }
            });
        }
    }

    /**
     * An alias for startDataReload(), you can pass this to nested components
     */
    onListUpdate() {
        this.startDataReload();
    }

    getItemDeleteMethodName() {
        return '';
    }

    async onItemDeleteConfirmedClick(id, params) {
        if (_.isStringNotEmpty(id)) {
            const method = this.getItemDeleteMethodName();
            if (_.isStringNotEmpty(method)) {
                this.execute(this.getItemDeleteMethodName(), [id]).then(() => {
                    Modal.close();
                    this.startDataReload();
                }).catch(() => {
                    Modal.close();
                    if (!_.isUndefined(params.button)) {
                        params.button.complete();
                    }
                });
            } else {
                const result = await this.getEntity().delete(id);
                if (result.isOk()) {
                    Modal.close();
                    this.startDataReload();
                } else {
                    Modal.close();
                    if (!_.isUndefined(params.button)) {
                        params.button.complete();
                    }
                }
            }
        }
    }

    onItemDelete(id) {
        ConfirmModal.open({
            isModal: true,
            onConfirmClick: this.onItemDeleteConfirmedClick.bind(this, id),
            headerText: t('Are you sure?'),
            text: t('This action cannot be undone.'),
        }, {
            size: 'S',
            showCloseButton: false,
            modalPage: true,
        });
    }

    getItemDeactivateMethodName() {
        return '';
    }

    onItemDeactivate(id) {
        if (_.isStringNotEmpty(id) && _.isStringNotEmpty(this.getItemDeactivateMethodName())) {
            this.execute(this.getItemDeactivateMethodName(), [id]).then(() => {
                this.startDataReload();
            }).catch(() => {

            });
        }
    }

    getItemActivateMethodName() {
        return '';
    }

    onItemActivate(id) {
        if (_.isStringNotEmpty(id) && _.isStringNotEmpty(this.getItemActivateMethodName())) {
            this.execute(this.getItemActivateMethodName(), [id]).then(() => {
                this.startDataReload();
            }).catch(() => {

            });
        }
    }

    getPrefix() {
        return this.props.prefix || '';
    }

    prefixizeParam(param) {
        const prefix = this.getPrefix();
        if (_.isStringNotEmpty(prefix)) {
            return `${prefix}_${param}`;
        }

        return param;
    }

    dePrefixizeParam(param) {
        const prefix = this.getPrefix();
        if (_.isStringNotEmpty(prefix)) {
            return param.replace(`^${prefix}_`, '');
        }

        return param;
    }

    /**
     * Returns separator char for storing multiple values in the url.
     * todo: instead of guessing with the separator char, it is better to pack values for the url
     * @returns {string}
     */
    getFilterSeparatorChar() {
        return ',';
    }

    getQueryParams() {
        return this.getRouter().getQueryParameters();
    }

    loadFiltersFromURL() {
        const chosenFilters = {};
        const fs = this.getFilterSettings();
        if (!_.isObjectNotEmpty(fs)) {
            return chosenFilters;
        }
        const queryParams = this.getQueryParams();
        _.each(fs.fields, (filter) => {
            const field = this.prefixizeParam(filter.field);
            if (queryParams[field]) {
                chosenFilters[filter.field] = [];

                let value = queryParams[field];
                if (value) {
                    if (filter.type !== BarFilterTypes.SEARCHBOX) {
                        value = value.split(this.getFilterSeparatorChar()).map(item => item.trim());
                        // const etalon = filter.values.map(item => item.key || item.value);
                        // value = _.intersection(value, etalon);
                    } else {
                        value = [value];
                    }
                    chosenFilters[filter.field] = value;
                }
            }
        });
        return chosenFilters;
    }

    extractSortFromUrl() {
        return null;
    }

    // :)
    getCurrentFilter() {
        return this.state.chosenFilters;
    }

    // ;)
    getChosenFilter() {
        return this.getCurrentFilter();
    }

    onReset() {
        this.resetUrl();
    }

    getCleanChosenFilters() {
        return {};
    }

    getCleanUrlParameters() {
        const params = {};
        params.page = null;
        _.each(this.getFilterSettings().fields, (filter) => {
            params[this.prefixizeParam(filter.field)] = null;
        });

        return params;
    }

    resetUrl() {
        this.getRouter().setQueryParameters(this.getCleanUrlParameters());
    }

    getUrlPathname() {
        return this.props.location.pathname;
    }

    /**
     * On filter rest, set page, chosen filters to empty and url
     */
    handleFiltersReset() {
        this.resetUrl();

        this.reInitializeList(this.getCleanChosenFilters());
    }

    getPageSizeForUrl() {
        if (this.state.perPage === this.getPageSizeFirstValue()) {
            return null;
        } else {
            return this.state.perPage;
        }
    }

    /**
     * On change filters, get new data and set url
     * @param filter
     * @param values
     */
    handleFilterChange(values) {
        const chosenFilters = _.clone(this.getCurrentFilter());

        const params = {};
        params[this.prefixizeParam('page')] = 1;
        params[this.prefixizeParam('size')] = this.getPageSizeForUrl();

        if (_.isArray(values) && values.length) {
            _.each(values, (value) => {
                let newValue = [];

                if (_.isArrayNotEmpty(value.value)) {
                    newValue = value.value;
                }

                chosenFilters[value.field] = newValue;
                params[this.prefixizeParam(value.field)] = _.isArrayNotEmpty(newValue) ? newValue.join(this.getFilterSeparatorChar()) : null;
            });
        }

        this.getRouter().setQueryParameters(params);
        this.reInitializeList(chosenFilters);
    }

    reInitializeList(url) {
        const sort = this.extractSortFromUrl(url);
        if (!_.isEqual(this.state.sort, sort)) {
            this.setState({
                sort,
            });
            this.clearQueryCache();
        }

        this.setState({
            chosenFilters: url,
            page: 1,
        }, () => {
            this.startDataReload();
        });
    }

    makeBackUrl(pageUrl) {
        pageUrl = pageUrl || this.props.location.pathname;

        let params = [
            `${this.prefixizeParam('page')}=${this.state.page}`
        ];
        if (this.getPageSizeForUrl()) {
            params.push(`${this.prefixizeParam('size')}=${this.getPageSizeForUrl()}`);
        }
        _.forEach(this.getCurrentFilter(), (v, k) => {
            if (v) {
                params.push(`${this.prefixizeParam(k)}=${encodeURIComponent(v.toString())}`);
            }
        });
        params = params.join('&');

        return `${pageUrl}?${params}`;
    }

    /**
     * Returns clone of the query instance returned with getListContainerClass()
     * @returns {Promise.<void>}
     * @access protected
     */
    async getQuery() {
        if (!this._cache.query) {
            // make one local copy of the global query
            this._cache.query = this.getQueryInstance().clone();
            this._cache.counterQuery = this.getQueryInstance().clone();
        }

        // we also start the reset timeout here, because
        // getQueryParameters is async and therefore can take some time execute
        this.setResetReadyTimeout();

        const params = await this.getQueryParameters();
        params.chosenFilters = this.getCurrentFilter();

        this._cache.query.setParameters(params);

        if (this.state.sort !== null) {
            this._cache.query.sort(this.state.sort);
        }

        return this._cache.query;
    }

    getQueryCached() {
        return this._cache.query || null;
    }

    /**
     * Invalidates the query cache, i.e. removes the local clone of the main query. Generally, should not be called.
     */
    clearQueryCache() {
        // if (this._cache.query) {
        //     this._cache.query.unsubscribe();
        // }
        this._cache.query = null;
        this._cache.counterQuery = null;
    }

    getQueryPaged() {
        const cached = this.getQueryCached();
        if (cached) {
            // not cloning here
            cached.setParams(this.getPageParameters());
            return cached;
        }
        return null;
    }

    getQueryCountCached() {
        return this._cache.counterQuery || null;
    }

    /**
     * Returns title labels
     * @returns {[string,string]}
     * @access protected
     */
    getLabels() {
        return [t('#NUM# result'), t('#NUM# results')];
    }

    getNavbarItems() {
        return this.props.navbarItems || [];
    }

    getPageSizeFirstValue() {
        const pageNavParameters = this.getPagenavParametes();
        if (pageNavParameters.sizeItems && pageNavParameters.sizeItems.length) {
            return pageNavParameters.sizeItems[0].value;
        }
        return 10;
    }

    /**
     * Returns page number specified in the URL
     * @returns {Number}
     * @access protected
     */
    get queryPage() {
        const queryParams = this.getQueryParams();
        return parseInt(queryParams[this.prefixizeParam('page')] || 1, 10);
    }

    /**
     * Returns page size specified in the URL
     * @returns {Number}
     * @access protected
     */
    get queryPageSize() {
        const queryParams = this.getQueryParams();
        return parseInt(queryParams[this.prefixizeParam('size')] || this.getPageSizeFirstValue(), 10);
    }

    /**
     * Sets page number back to the URL
     * @param {Number} page
     * @access protected
     */
    set queryPage(page) {
        this.getRouter().setQueryParameter(this.prefixizeParam('page'), page);
    }

    /**
     * Sets page number back to the URL
     * @param {Number} size
     * @access protected
     */
    set queryPageSize(size) {
        this.getRouter().setQueryParameter(this.prefixizeParam('size'), size);
    }

    loadItems() {
        const query = this.getQueryCached();
        if (!query) {
            throw new Error('Calling loadItems() while query is not ready');
        }

        query.exec().then((res) => {
            this.setItems(res.data);
            this.setCount(res.total, this.queryPage);
        }).catch((err) => {
            console.error('Unable to get items (forgot to expose?)', err);
        });
    }

    async setItems(items) {
        items = await this.treatRetrievedData(items);
        // console.dir('set items done');
        this.setReadyState({
            items,
            itemsReady: true,
        });
    }

    async setCount(total, page) {
        this.setReadyState({
            total,
            countReady: true,
        });
        this.setState({
            page,
        });
    }

    /**
     * Retrives count from the state
     * @returns {number}
     * @access protected
     * @deprecated
     */
    get count() {
        return this.state.total;
    }

    getCount() {
        return this.state.total;
    }

    /**
     * Returns page navigation parameters for the query
     * @returns {{limit: (number|*), skip: number}}
     * @access protected
     */
    getPageParameters() {
        return {
            limit: this.state.perPage,
            skip: this.state.perPage * (this.state.page - 1),
        };
    }

    setPageSize(field) {
        this.setState({
            perPage: field.key,
            page: 1
        }, () => {
            this.queryPageSize = field.key;
            this.startDataReload();
        });
    }

    getPagenavParametes() {
        return {
            sizeItems: [
                {
                    key: 10,
                    value: '10'
                }, {
                    key: 20,
                    value: '20'
                }, {
                    key: 50,
                    value: '50'
                }, {
                    key: 100,
                    value: '100'
                }
            ]
        };
    }

    /**
     * Returns list container parameters, to create the React.Component instance
     * @returns {{}}
     * @access protected
     */
    getListParameters() {
        return {
            data: this.state.items,
            backUrl: this.makeBackUrl(),
            itemClass: this.getListItemComponentClass(),
            itemParametersMapper: this.getItemParametersMapper(),
            onListUpdate: this.onListUpdate.bind(this),
            className: 'data-block-stack',
            // className: 'media-block_list',
            ready: this.isReady(),
            // nothingFoundButtonLink: this.getResetLink(),
            onNothingFoundButtonClick: this.handleFiltersReset.bind(this),
            onDelete: this.onItemDelete.bind(this),
            onDeactivate: this.onItemDeactivate.bind(this),
            onActivate: this.onItemActivate.bind(this),
        };
    }

    getFilterParameters() {
        return {
            className: 'navbar-filter_one-row no-min-height',
            filters: this.getFilterSettings(),
            chosenFilters: this.state.chosenFilters,
            onChange: this.handleFilterChange.bind(this),
            showHeader: false,
            enableMobileVersion: false,
            total: this.getCount(),
            theme: this.getNavbarTheme()
        };
    }

    scrollIfReady() {
        if (this.isReady() && !this._scrolled && this.props.allowScrollToStored) {
            PageScroll.scrollToStored();
            this._scrolled = true;
        }
    }

    /**
     * You can transform data here, using some async operations
     * @param data
     * @returns {Promise.<*>}
     */
    async prepareCSVData(data) {
        return data;
    }

    getCSVHeaders() {
        return null;
    }

    getCSVExporter() {
        if (!this._csvExporter) {
            this._csvExporter = new CSVExporter({
                header: this.getCSVHeaders(),
            });
        }

        return this._csvExporter;
    }

    exportCSV(...params) {
        this.getQueryParametersCSVExport().then((parameters) => {
            parameters.chosenFilters = this.getCurrentFilter();
            this.getExportQueryInstance().clone(parameters).fetch((err, res) => {
                if (_.isArrayNotEmpty(params)) {
                    const button = params.pop();

                    if (_.isObject(button) && _.isFunction(button.complete)) {
                        button.complete();
                    }
                }

                if (!err) {
                    this.prepareCSVData(res).then((transformed) => {
                        this.getCSVExporter().export(transformed);
                    });
                }
            });
        });
    }

    renderItems() {
        return (
            <div className={`list-tile ${this.props.listClassName} ${this.getCount() > 0 ? '' : 'list-tile_no-margin'}`}>
                {React.createElement(this.getListContainerClass(), this.getListParameters())}
            </div>
        );
    }

    /**
     * Renders page navigator
     * @returns {XML|null}
     * @access protected
     */
    renderPageNav() {
        if (!this.getCount() || this.getCount() <= this.state.perPage) {
            return null;
        }
        return (
            <div className="data-block__content text-center paginator-block">
                <Paginator
                    activePage={this.state.page}
                    itemsCountPerPage={this.state.perPage}
                    totalItemsCount={this.getCount()}
                    onChange={this.onPageChange.bind(this)}
                />
            </div>
        );
    }

    renderItemsCount(ready) {
        const labels = this.getLabels();
        let label = '';

        if (ready) {
            if (this.getCount() > 0) {
                label = this.getCount() === 1 ? labels[0] : labels[1];
            }

            if (!_.isStringNotEmpty(label)) {
                return null;
            }
        }

        return (
            <div>
                {
                    ready
                    &&
                    <div>
                        <span className="filter-footer__count">
                            {label.replace('#NUM#', Util.formatNumber(this.getCount()))}
                        </span>
                    </div>
                }
            </div>
        );
    }
    renderPageSizeSelector() {
        const pageNavParameters = this.getPagenavParametes();
        return (
            <SelectCompact
                className=""
                searchable={false}
                placeholder={t('Show $(0) results', this.getPageSize())}
                name="perPage"
                options={pageNavParameters.sizeItems}
                onChange={this.setPageSize.bind(this)}
                multiple={false}
                value={this.state.perPage}
                dynamicPlaceholder={false}
            />
        );
    }

    needPageNav() {
        return true;
    }

    needFilter() {
        return false;
    }

    needHeader() {
        return false;
    }

    needItemsCount() {
        return true;
    }

    needChosenFilterValues() {
        return false;
    }

    getNavbarTheme() {
        return 'light';
    }

    renderFilter() {
        if (this.getFilterSettings()) {
            const fParams = this.getFilterParameters();

            return (
                <BarFilter
                    {...fParams}
                />
            );
        }

        return null;
    }

    renderBefore() {
        return null;
    }

    /**
     * Renders the component
     * @returns {XML}
     * @access protected
     */
    render() {
        const ready = this.isReady();
        return (
            <Layout
                top={
                    <div>
                        {
                            this.renderBefore(ready)
                        }
                        <div className={`navbar-filter_${this.getNavbarTheme()}`}>
                            <div className={`navbar-filter_${this.getNavbarTheme()}-container`}>
                                {
                                    this.needFilter()
                                    &&
                                    this.renderFilter()
                                }
                                {
                                    this.needItemsCount() &&
                                    <div className="filter-footer clearfix">
                                        <div className="rb-float_left">
                                            {
                                                this.renderItemsCount(ready)
                                            }
                                        </div>
                                        <div className="rb-float_right">
                                            {
                                                this.renderPageSizeSelector()
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                }
                central={
                    <div className={`block-stack block-stack__no-border ${this.props.className}`}>
                        {
                            this.needChosenFilterValues()
                            &&
                            <GatewayDest name="filter" className="data-block__no-border" />
                        }

                        <div className="data-block data-block_no-background">
                            {
                                this.props.newLink
                                &&
                                <Link to={this.props.newLink} className="list-tile__new ">
                                    <div className="icon icon_add" />
                                </Link>
                            }
                            {
                                _.isFunction(this.props.onTriggerAction)
                                &&
                                <a onClick={() => this.props.onTriggerAction()} className="list-tile__new cursor_pointer">
                                    <div className="icon icon_compare_arrows" />
                                </a>
                            }
                            <div className="data-block__content data-block__content_no-padding">
                                {
                                    this.renderItems(ready)
                                }
                            </div>
                            {
                                this.needPageNav() && ready
                                &&
                                this.renderPageNav()
                            }
                        </div>
                    </div>
                }
                backUrl="/"
            />
        );
    }
}
