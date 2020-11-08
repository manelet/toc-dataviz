import React from "react";
import { renderRoutes } from "react-router-config";
import Navbar from './components/Navbar';

import 'font-awesome/css/font-awesome.css';
import 'bulma/css/bulma.css';
import './App.css';

export default class Root extends React.Component {
    state = {
        loading: true
    }

    componentDidMount() {
        if (!this.state.loading) {
            document.getElementsByTagName("html")[0].classList.add("has-navbar-fixed-top");        
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.loading && prevState.loading) {
            document.getElementsByTagName("html")[0].classList.add("has-navbar-fixed-top");        
        }
    }
    

    switchLoading = () => this.setState({ loading: !this.state.loading });
    
    render = () => {
        const { cities, route, categories, city } = this.props;
        const { loading } = this.state;

        return (
            <div className="AppRoot">
                { !loading ? <Navbar cities={cities} city={city} /> : null }
                { renderRoutes(route.routes, { switchLoading: this.switchLoading, loading, cities, city, categories }) }
            </div>
        );
    }
}

        