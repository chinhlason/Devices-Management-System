import Login from '~/pages/login';
import Service from '~/pages/service';
import { HeaderOnly } from '~/components/Layout';

const publicRoutes = [
    { path: '/', component: Login, layout: null },
    { path: '/service', component: Service },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
