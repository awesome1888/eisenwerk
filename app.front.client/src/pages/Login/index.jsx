import React from 'react';
import Layout from '../../components/LayoutInner';
import * as reducer from './reducer';
import connectPage from '../../shared/lib/connectPage';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginPage = () => (
    <Layout>
        <Formik
            initialValues={{ login: '', password: '' }}
            onSubmit={(values, { setSubmitting }) => {
                console.dir(values);
                setSubmitting(false);
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
                            <label htmlFor="email" style={{ display: 'block' }}>
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
                            <label htmlFor="email" style={{ display: 'block' }}>
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

export default connectPage({ reducer })(LoginPage);
