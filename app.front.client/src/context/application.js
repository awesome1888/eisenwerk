import React from 'react';

export const context = React.createContext(null);
const connectContext = Component => props => (
    <context.Consumer>
        {application => <Component application={application} {...props} />}
    </context.Consumer>
);

export default connectContext;
