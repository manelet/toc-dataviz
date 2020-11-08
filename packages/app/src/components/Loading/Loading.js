import React from "react";
import './Loading.css';
import loading from './puff.svg'

export default props =>
    <div className="loading">
        <p className="localmaps">
            <strong>local</strong>maps
        </p>
        <p className="loading-text">{props.message}</p>
        <img src={loading} alt="loading" />
    </div>