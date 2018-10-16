import React from 'react';
import PropTypes from 'prop-types';

import './style.less';

export default class NothingFound extends React.Component {

    static propTypes = {
        showFilterButton: PropTypes.bool,
        onButtonClick: PropTypes.func,
    };

    static defaultProps = {
        showFilterButton: false,
        onButtonClick: null,
    };
    onButtonClick() {
        if (_.isFunction(this.props.onButtonClick)) {
            this.props.onButtonClick();
        }
    }
    getButtonText() {
        return (this.props.showFilterButton ? t('Reset') : t('Home'));
    }

    render() {
        return (
            <div className="data-block">
                <div className="data-block__content data-block__content_no-padding data-block__content_mobile nothing-found line-height_0">
                    <div className="text_size_bigger text_title margin-bottom_x0p5">
                        {t('No results')}
                    </div>
                    <div className="text_size_normal nothing-found__text-crop">
                        {t('Change your search query or try again later.')}
                    </div>
                    <button
                        className="button button_white-gray rb-margin-t_x2 text-uppercase"
                        onClick={this.onButtonClick.bind(this)}
                    >
                        {
                            this.getButtonText()
                        }
                    </button>
                </div>
            </div>
        );
    }
}
