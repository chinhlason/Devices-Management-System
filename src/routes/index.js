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
import Department from '~/pages/department';
import CategoryDevice from '~/pages/categoryDevice';
import ImportCoupon from '~/pages/importCoupon';
import ExportCoupon from '~/pages/exportCoupon';
import WarrantyCoupon from '~/pages/warrantyCoupon';
import MainPage from '~/pages/userMainPage';
import ProfileUser from '~/pages/profileUser';
import DeviceByUsers from '~/pages/deviceByUser';
import ExportListByUser from '~/pages/exportListByUser';
import NotiPage from '~/pages/notiPage';
import HandOver from '~/pages/handOver';
import ResetPassword from '~/pages/resetPassword';
import SearchDevice from '~/pages/searchDevice';
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
    { path: '/department', component: Department },
    { path: '/categorydevice', component: CategoryDevice },
    { path: '/importcoupon', component: ImportCoupon },
    { path: '/exportcoupon', component: ExportCoupon },
    { path: '/warrantycoupon', component: WarrantyCoupon },
    { path: '/mainpage', component: MainPage },
    { path: '/profileuser', component: ProfileUser },
    { path: '/devicebyusers', component: DeviceByUsers },
    { path: '/exportlistbyuser', component: ExportListByUser },
    { path: '/notification', component: NotiPage },
    { path: '/handover', component: HandOver },
    { path: '/search', component: SearchDevice },
    { path: '/resetpassword', component: ResetPassword, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
