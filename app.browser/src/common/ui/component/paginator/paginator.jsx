import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PageScroll from '../../../lib/util/page-scroll/page-scroll.js';
import Util from '../../../lib/util/index.js';

import './style.less';

export default class Paginator extends Component {
    static propTypes = {
        // This component gets the task to display through a React prop.
        // We can use propTypes to indicate it is  required
        activePage: PropTypes.number.isRequired,
        itemsCountPerPage: PropTypes.number.isRequired,
        totalItemsCount: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        activePage: 1,
        itemsCountPerPage: 10,
        totalItemsCount: 0,
        onChange: null
    };

    onClick(pageNumber) {
        PageScroll.scrollTo();
        this.props.onChange(pageNumber);
    }

    displayItems(activePage) {
        let itemMax = activePage * this.props.itemsCountPerPage;
        if (itemMax > this.props.totalItemsCount) {
            itemMax = this.props.totalItemsCount;
        }
        const itemMin = (this.props.itemsCountPerPage * (activePage - 1)) + 1;
        return `${Util.formatNumber(itemMin)} - ${Util.formatNumber(itemMax)}`;
    }

    render() {
        const totalPages = Math.ceil(this.props.totalItemsCount / this.props.itemsCountPerPage);
        const activePage = this.props.activePage;
        return (
            <div className="paginator-line">
                {activePage > 1 &&
                <div className="pagination__group">
                    <a className="pagination__link pagination__link-first" onClick={this.onClick.bind(this, 1)}></a>
                    <a className="pagination__link pagination__link-prev" onClick={this.onClick.bind(this, activePage - 1)}></a>
                </div>
                }
                <div className="pagination__group">
                    <span className="pagination__current-page">
                        {t('Results $(0) of $(1)', this.displayItems(activePage), Util.formatNumber(this.props.totalItemsCount))}
                    </span>
                </div>
                {activePage < totalPages &&
                <div className="pagination__group">
                    <a className="pagination__link pagination__link-next" onClick={this.onClick.bind(this, activePage + 1)}></a>
                    <a className="pagination__link pagination__link-last" onClick={this.onClick.bind(this, totalPages)} ></a>
                </div>
                }
            </div>
        );
    }
}
