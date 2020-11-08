import React from "react";
import categoriesMap from '../../categories';

import wordIcon from './word.svg';
import mapIcon from './map.svg';

import './Detail.css';

const icons = {
    "application": wordIcon,
    "mapa": mapIcon
};

const Media = props =>
    <div className={`detail__media ${props.tipus}`}>
        <a href={props.url} target="_BLANK">
            <img className="icon" src={icons[props.tipus]} alt={`icon-${props.tipus}`} />
            <p className="detail__media__filename">
                {props.filename}
            </p>
        </a>
    </div>

const MediaMap = props =>
    <div className="detail__media mapa" onClick={props.switchStreetView}>
        <a>
            <img className="icon" src={mapIcon} alt="icon-map" />
            <p className="detail__media__filename">
                Veure a StreetView
            </p>
        </a>
    </div>

export default class Detail extends React.Component {

    constructor(params) {
        super(params);

        this.state = {
            showMap: false,
            map: undefined
        };
    }

    componentDidMount() {
        window.google.load("maps", "3", {
            other_params:`key=${process.env.GOOGLEMAPS_KEY}`, 
            callback: () => {
                const map = new window.google.maps.Map(document.getElementById('street-view'), {
                    center: this.props.coords,
                    zoom: 14
                });

                this.setState({ map });
            }
        });
    }

    switchStreetView = () => {
        const showMap = !this.state.showMap;
        this.setState(
            { showMap }, 
            () => {
                if (showMap) {
                    const panorama = new window.google.maps.StreetViewPanorama(
                        document.getElementById('pano'), {
                            position: this.props.coords,
                            fullscreenControl: false,
                            pov: {
                                heading: 34,
                                pitch: 10
                            }
                        });
                    this.state.map.setStreetView(panorama);
                }
            }
        );
    }

    render () {
        const { pic, categories, title, cost, data, address, text, media, closeCard } = this.props;
        const style = !this.state.showMap ? {display: "none"} : {};

        return (
            <div className="detail">
                <div className="detail__head" style={{ background: `url(${pic}) no-repeat`}}>
                    <p className="title">{title}</p>
                    { address ? 
                        <p className="subtitle">
                            <span role="img" aria-label="subtitle">
                                🗺
                            </span>
                            {address}
                        </p>
                    : null }
                    <div className="detail__meta">
                        <ul className="inline-list">
                            <li>
                                <span className="tag is-rounded">
                                    <span role="img" aria-label="calendar">📅</span> {data.format("DD MMM YYYY")}
                                </span>
                            </li>
                            <li>
                                <span className="tag is-rounded">
                                    <span role="img" aria-label="cost">💰</span> {cost}€
                                </span>
                            </li>
                            { categories.map(c => 
                            <li key={c}>
                                <span className={`tag is-rounded ${categoriesMap[c]}`}>
                                    {c}
                                </span>
                            </li>
                            )}
                        </ul>
                    </div>
                </div>
                <span className="delete is-medium is-pulled-right" onClick={closeCard}></span>
                <div className="detail__body columns">
                    { text ? 
                        <div className="column is-two-thirds">
                            {text}
                        </div>
                    : null}
                    <div className="column">
                        { media && media.length ?
                            <ul className="detail__mediaList">
                                {media
                                    .filter(m => m.type.indexOf("image/") === -1)
                                    .map((m,i) => 
                                        <li key={`mediaList-${i}`}>
                                            <Media 
                                                key={i} 
                                                {...m} 
                                                tipus={m.type.split("/")[0]} />
                                        </li>
                                    )}
                                <li>
                                    <MediaMap switchStreetView={this.switchStreetView} />
                                </li>
                            </ul>
                        : null}
                    </div>
                </div>
                <div className="detail__map columns" style={style}>
                    <div id="street-view"></div>
                    <div className="column">
                        <div id="pano"></div>
                    </div>
                    <span className="delete is-medium" onClick={this.switchStreetView}></span>
                </div>
            </div>
        );
    }
}