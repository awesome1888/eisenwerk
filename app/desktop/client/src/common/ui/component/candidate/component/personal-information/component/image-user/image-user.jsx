import React from 'react';

export default class ImageUser extends React.Component {
    render() {
        const props = this.props;
        const hasAvatar = !_.isEmpty(props.avatarStyle);
        return (
            <div
                className={hasAvatar ? 'image_medal_logo' : 'image_initials'}
            >
                {
                    hasAvatar
                    &&
                    <div
                        style={props.avatarStyle}
                    />
                }
                {
                    props.initials &&
                    <div>
                        {props.initials}
                    </div>
                }
            </div>
        );
    }
}
