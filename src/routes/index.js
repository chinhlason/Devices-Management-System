import { HeaderOnly } from '~/components/Layout';

import Login from '~/pages/login';
import Service from '~/pages/service';
import Profile from '~/pages/profile';

const publicRoutes = [
    { path: '/', component: Login, layout: null },
    { path: '/service', component: Service },
    { path: '/profile', component: Profile },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
