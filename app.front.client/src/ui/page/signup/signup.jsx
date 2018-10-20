import React from 'react';
// import PropTypes from 'prop-types';
import BasePage from '../../../common/lib/ui/page/index.jsx';
import Layout from '../../../common/ui/component/layout.page.one-column/index.jsx';
import Signup from '../../component/signup/signup.jsx';
import SignupStep from '../../component/signup/component/step/step.jsx';
import {withRouter} from "react-router";

class SignupPage extends BasePage {

    renderSignup() {
        return (
            <Layout
                central={
                    <Signup />
                }
            />
        );
    }

    renderStep(step) {
        return (
            <Layout
                central={
                    <SignupStep step={step} />
                }
            />
        );
    }

    render() {
        const step = _.getValue(this.props, 'match.params.step');

        if (_.isUndefined(step)) {
            return this.renderSignup();
        } else {
            return this.renderStep(step);
        }
    }
}

export default withRouter(SignupPage);
