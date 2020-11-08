import React from "react";

export default class ToggleMap extends React.Component {
    render () {
        const { panelVisible, switchPanel } = this.props;

        return (
            <div className="toggle-map is-small tabs is-toggle is-toggle-rounded is-hidden-tablet">
                <ul>
                    <li className={panelVisible === "list" ? `is-active`: null}>
                        <a onClick={switchPanel}>
                            <span className="icon is-small"><i className="fa fa-list-ul"></i></span>
                            <span>Llistat</span>
                        </a>
                    </li>
                    <li className={panelVisible === "map" ? `is-active`: null}>
                        <a onClick={switchPanel}>
                            <span className="icon is-small"><i className="fa fa-map"></i></span>
                            <span>Mapa</span>
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}    