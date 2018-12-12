import React from 'react';
import * as reducer from './reducer';
import connectPage from '../../shared/lib/connectPage';
import connectApplication from '../../context/application';

const LogoutPage = () => '';

export default connectPage({ reducer })(connectApplication(LogoutPage));
