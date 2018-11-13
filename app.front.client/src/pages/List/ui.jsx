import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/LayoutInner';
// import { Link } from 'react-router-dom';
import * as reducer from './reducer';

class ListPage extends React.Component {
    componentDidMount() {
        this.props.dispatch({type: reducer.LIST_START});
    }

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
                {/*<Link to="/">Home</Link>*/}
            </Layout>
        );
    }
}

export default connect(state => state.list)(ListPage);
