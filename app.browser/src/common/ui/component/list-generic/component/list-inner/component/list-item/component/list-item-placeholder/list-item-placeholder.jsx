import React from 'react';

import './style.less';

const PlaceHolder = params => (
    <div className="data-block">
        <div className="data-block__content">
            <div
                className={
                    `list-item__placeholder-inner ${params && params.small ? 'list-item__placeholder-inner_small' : ''} ${params && params.large ? 'list-item__placeholder-inner_large' : ''}`
                }
            />
        </div>
    </div>
);

export default PlaceHolder;
