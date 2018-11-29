import React from 'react';

export default ({ status, error }) => {
    return (
        <div className="">
            {status === 401 && <div className="">Not authorized</div>}
            {status === 403 && <div className="">Forbidden</div>}
            {status !== 401 && status !== 403 && (
                <div className="">
                    Sorry, but that`s an error. ({error.message})
                </div>
            )}
        </div>
    );
};
