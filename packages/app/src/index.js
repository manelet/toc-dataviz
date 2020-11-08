import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import cities from './cities';
import categories from './categories';
import Routes from './Routes';

ReactDOM.render(
    <BrowserRouter>
        { renderRoutes(Routes, { cities, city: cities[0], categories }) }
    </BrowserRouter>
    , document.getElementById('root')
);