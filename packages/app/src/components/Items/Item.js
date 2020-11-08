import React from "react";
import categoriesMap from '../../categories';
import notAvailable from './not-available.png';

export default props => {
    const { 
        address, 
        title, 
        data, 
        cost,
        pic, 
        openCard, 
        id, 
        setHovered, 
        unsetHovered, 
        categories 
    } = props;

    const subtitle = address !== undefined ?
        <p className="subtitle is-6">{address}</p>
        : null;

    return (
        <div 
            className="item" 
            onClick={() => openCard(id) }
            onMouseEnter={() => setHovered(id) }
            onMouseLeave={() => unsetHovered() }
        >
            <div className="image is-hidden-mobile">
                <img alt={title} src={pic || notAvailable} />
            </div>
            <div className="details">
                <p className="title is-4">{title}</p>
                { subtitle }

                <div className="metadata">
                    <div className="labels">
                        <ul className="inline-list">
                            <li>
                                <span className="tag is-rounded">
                                    <span role="img" aria-label="calendar">📅</span> {data.fromNow()}
                                </span>
                            </li>
                            <li>
                                <span className="tag is-rounded">
                                    <span role="img" aria-label="cost">💰</span> {cost}€
                                </span>
                            </li>
                        </ul>                    
                    </div>

                    <div className="categories">
                        <ul>
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
            </div>
        </div>
    );
}