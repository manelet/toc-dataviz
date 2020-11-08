import React from "react";
import { Link } from "react-router-dom";

export default class NavBar extends React.Component {
    componentDidMount() {
        const $el = document.querySelector('.navbar-burger');

        if ($el) {
            $el.addEventListener('click', function () {
                const target = $el.dataset.target;
                const $target = document.getElementById(target);

                $el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        }  
    }
    
    render () {
        const { cities, city } = this.props;

        return (
            <nav className="navbar is-fixed-top">
                <div className="navbar-brand">
                    <Link className="navbar-item localmaps" to="/">
                        <strong>local</strong>maps
                    </Link>
                    <div className="navbar-burger burger" data-target="navbarMenu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div className="navbar-menu" id="navbarMenu">
                    <div className="navbar-start">
                        <Link className="navbar-item" to="/">
                            🗺 Mapa
                        </Link>
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">
                                <span role="img" aria-label="Ciutats">🏘</span> Ciutats
                            </a>
                            <div className="navbar-dropdown is-boxed">
                                {cities.map(c => 
                                    <Link 
                                        key={c.name} 
                                        className={`navbar-item${c.name === city.name ? " is-active" : ""}`} 
                                        to={`/?ciutat=${c.name}`}>
                                            {c.name}
                                    </Link> 
                                )}
                            </div>
                        </div>
                        <Link className="navbar-item" to="/estadistiques">
                            <span role="img" aria-label="Estadístiques">📈</span> Estadístiques
                        </Link>
                        <Link className="navbar-item" to="/qui-som">
                            <span role="img" aria-label="Qiu som">🙋‍♂</span>️ Qui som
                        </Link>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <button className="button is-small is-rounded">
                                <span className="icon">
                                    <i className="fa fa-twitter"></i>
                                </span>
                                <span>Piula-ho!</span>
                            </button>
                        </div>
                        <div className="navbar-item">
                            <button className="button is-small is-rounded">
                                <span className="icon">
                                    <i className="fa fa-facebook"></i>
                                </span>
                                <span>Comparteix!</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>            
        );
    }
}