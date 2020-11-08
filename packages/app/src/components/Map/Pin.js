import React from "react";
import './Pin.css';

export default props => {
    const hovered = props.hoveredId === props.id ? "is-hovered" : "";
    return (
        <div 
            onClick={() => props.openCard(props.id)} 
            className={`pin ${hovered}`}>
        </div>
    );
}
    