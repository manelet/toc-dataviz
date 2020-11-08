import Root from './Root';
import App from './App';
import QuiSom from './pages/QuiSom/';
import Estadistiques from './pages/Estadistiques';

export default [
    { 
        component: Root,
        routes: [
            {
                path: '/',
                exact: true,
                component: App
            },
            {
                path: '/qui-som',
                exact: true,
                component: QuiSom
            },
            {
                path: '/estadistiques',
                exact: true,
                component: Estadistiques
            }
        ]
    }   
];
 