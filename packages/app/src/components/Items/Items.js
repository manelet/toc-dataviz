import React, { Component } from "react";
import Infinite from 'react-infinite';

import Item from './Item';
import Filters from './Filters';

import './Items.css';

export default class Items extends Component {
    getItems = () => 
        this.props.data.map(item => 
            <Item
                key={item.id}
                openCard={this.props.openCard} 
                setHovered={this.props.setHovered}
                unsetHovered={this.props.unsetHovered}
                {...item}
            />
        );

    render () {
        const { filters, onSliderChange, onCategoryChange, city, data } = this.props;
        const items = this.getItems();

        return (
            <div style={{ width: "100%" }}>
                <section style={{padding: ".75rem", margin: "1em 0"}}>
                    <p className="title">
                        {city.name} &nbsp;
                        <span className="subtitle" style={{fontWeight: "200"}}>
                            ({data.length} obres i millores)
                        </span>
                    </p>
                </section>
                <Filters 
                    {...filters} 
                    onChange={onSliderChange} 
                    onCategoryChange={onCategoryChange}
                />
                <Infinite 
                    useWindowAsScrollContainer 
                    elementHeight={175}
                    className="listings"
                >
                    {items}
                </Infinite>
            </div>
        );
    }
}