import { HeaderOnly } from '~/components/Layout';

import Login from '~/pages/login';
import Service from '~/pages/service';
import Profile from '~/pages/profile';
import SignUp from '~/pages/signup';
import Update from '~/pages/update';
import AddDevice from '~/pages/addDevice';
import Export from '~/pages/export';
import UpdateDevices from '~/pages/updateDevice';
import ExportListDevice from '~/pages/exportListDevices';
const publicRoutes = [
    { path: '/', component: Login, layout: null },
    { path: '/service', component: Service },
    { path: '/profile', component: Profile },
    { path: '/signup', component: SignUp },
    { path: '/update', component: Update },
    { path: '/adddevice', component: AddDevice },
    { path: '/exportdevice', component: Export },
    { path: '/exportlistdevice', component: ExportListDevice },
    { path: '/updatedevice', component: UpdateDevices },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
