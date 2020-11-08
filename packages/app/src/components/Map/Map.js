import React, { Component } from "react";
import GoogleMapReact from 'google-map-react';

import Pin from './Pin';
import './Map.css';

const key = "AIzaSyC0EFtzZRMNgXcU6LKLFqOwMPF1QMe7EfY";

export default class Map extends Component {
    createMarkers = () =>
        this.props.pins && this.props.pins.length 
            ? this.props.pins.map(pin => 
                <Pin
                    key={`pin-${pin.id}`}
                    hoveredId={this.props.hoveredId} 
                    openCard={this.props.openCard}
                    {...pin} 
                />
            ) : null;

    render () {
        const { center, zoom } = this.props;
        const markers = this.createMarkers();

        return (
            <div className="map">
                <GoogleMapReact
                    bootstrapURLKeys={{ key }}
                    center={center}
                    zoom={zoom}
                    defaultCenter={{lat: 0, lng: 0}}
                    defaultZoom={15}>
                    { markers }
                </GoogleMapReact>
            </div>
        );
    }
}