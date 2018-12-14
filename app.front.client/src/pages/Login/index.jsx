import React from 'react';
import Layout from '../../components/LayoutInner';
import * as reducer from './reducer';
import connectPage from '../../shared/lib/connectPage';
// import connectApplication from '../../context/application';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as applicationReducer from '../../components/Application/reducer';

const LoginPage = props => {
    const { application, dispatch } = props;
    console.dir('login props');
    console.dir(props);
    return (
        <Layout>
            <Formik
                initialValues={{ login: '', password: '' }}
                onSubmit={(values, { setSubmitting }) => {
                    application
                        .getAuthorization()
                        .signInLocal(values.login, values.password)
                        .then(userId => {
                            dispatch({
                                type: applicationReducer.USER_LOAD,
                                payload: {
                                    userId,
                                    application,
                                },
                            });
                            setSubmitting(false);
                        })
                        .catch(e => {
                            console.dir('ERROR!');
                            console.dir(e);
                            setSubmitting(false);
                        });
                }}
                validationSchema={Yup.object().shape({
                    login: Yup.string()
                        .email()
                        .required('Required'),
                })}
            >
                {props => {
                    const {
                        values,
                        touched,
                        errors,
                        dirty,
                        isSubmitting,
                        handleChange,
                        // handleBlur,
                        handleSubmit,
                        handleReset,
                    } = props;
                    return (
                        <form onSubmit={handleSubmit}>
                            <div className="">
                                <label
                                    htmlFor="email"
                                    style={{ display: 'block' }}
                                >
                                    Email
                                </label>
                                <input
                                    name="login"
                                    placeholder="Enter your email"
                                    type="text"
                                    value={values.login}
                                    onChange={handleChange}
                                    // onBlur={handleBlur}
                                    className={
                                        errors.login && touched.login
                                            ? 'text-input error'
                                            : 'text-input'
                                    }
                                />
                                {errors.login && touched.login && (
                                    <div className="input-feedback">
                                        {errors.login}
                                    </div>
                                )}
                            </div>
                            <div className="">
                                <label
                                    htmlFor="password"
                                    style={{ display: 'block' }}
                                >
                                    Password
                                </label>
                                <input
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    // onBlur={handleBlur}
                                    className={
                                        errors.password && touched.password
                                            ? 'text-input error'
                                            : 'text-input'
                                    }
                                />
                                {errors.password && touched.password && (
                                    <div className="input-feedback">
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                className="outline"
                                onClick={handleReset}
                                disabled={!dirty || isSubmitting}
                            >
                                Reset
                            </button>
                            <button type="submit" disabled={isSubmitting}>
                                Submit
                            </button>
                        </form>
                    );
                }}
            </Formik>
        </Layout>
    );
};

// export default connectPage({ reducer })(connectApplication(LoginPage));
export default connectPage({ reducer })(LoginPage);
