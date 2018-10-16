import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './../list-inner/component/list-item/list-item.jsx';

export default class GenericCMSListItem extends ListItem {
    static propTypes = {
        url: PropTypes.string,
        onClick: PropTypes.func,
        title: PropTypes.string,
        text1Line1: PropTypes.string,
        text2Line1: PropTypes.string,
        text1Line2: PropTypes.string,
        text2Line2: PropTypes.string,
    };

    static defaultProps = {
        url: null,
        onClick: () => {},
        title: '',
        text1Line1: '',
        text2Line1: '',
        text1Line2: '',
        text2Line2: '',
    };

    getPlaceholderParameters() {
        return {small: true};
    }

    render() {
        if (!this.isReady()) {
            return this.renderPlaceholder();
        }

        return (
            <a
                className="data-block data-block_link"
                href={this.props.url}
                onClick={this.props.onClick}
                data-save-scroll
            >
                <div
                    className="data-block__content "
                >
                    <div className="media-block">
                        <div className="media-block__grid media-block__grid_adaptive content_v-center">
                            {
                                this.props.image &&
                                <div className="media-block__left-2offset">
                                    <div className="media-block__left-image-small">
                                        <span
                                            className="media-block__left-image-small image_sevenlanes"
                                            style={{ backgroundImage: `url(${this.props.image})`}}
                                        >&nbsp;</span>
                                    </div>
                                </div>
                            }
                            <div className="media-block__center media-block__right_adaptive-xs-special">
                                <div className="media-block__center-title_medium text_weight_normal text_size_big">
                                    <span
                                        className="media-block__center-label link-hover"
                                    >
                                        {this.props.title}
                                    </span>
                                </div>
                                {
                                    (this.props.text1Line1 || this.props.text2Line1) &&
                                    <div className="text_weight_normal text_size_minor">
                                        {
                                            this.props.text1Line1 &&
                                            <span className="media-block__center-label">{this.props.text1Line1}</span>
                                        }
                                        {
                                            this.props.text2Line1 &&
                                            <span> • <span className="media-block__center-label">{this.props.text2Line1}</span></span>
                                        }
                                    </div>
                                }
                                {
                                    (this.props.text1Line2 || this.props.text2Line2) &&
                                    <div className="text_weight_normal text_size_minor">
                                        {
                                            this.props.text1Line2 &&
                                            <span className="media-block__center-label">{this.props.text1Line2}</span>
                                        }
                                        {
                                            this.props.text2Line2 &&
                                            <span> • <span className="media-block__center-label">{this.props.text2Line2}</span></span>
                                        }
                                    </div>
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </a>
        );
    }
}
