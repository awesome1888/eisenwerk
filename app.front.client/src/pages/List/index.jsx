import React from 'react';
import Layout from '../../components/LayoutInner';
import { Link } from 'react-router-dom';
import * as reducer from './reducer';
import page from '../../shared/components/Page';

class ListPage extends React.Component {
    render() {
        return (
            <Layout>
                {
                    _.isArrayNotEmpty(this.props.data)
                    &&
                    <div className="">
                        {this.props.data.map(item => (
                            <div className="" key={item.name}>
                                {item.name}
                            </div>
                        ))}
                    </div>
                }
                <Link to="/">Home</Link><br />
                <Link to="/?__ssr=1">Home (static)</Link><br />
            </Layout>
        );
    }
}

export default page(ListPage, reducer, state => state.list);
