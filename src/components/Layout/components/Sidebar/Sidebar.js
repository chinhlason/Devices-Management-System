import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import React, { useState } from 'react';
import UserSidebar, { LogOut, UserProfile } from './userSidebar';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import MainPage from './mainPage';

const cx = classNames.bind(styles);

function Sidebar() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role');
    console.log(role);
    const navigate = useNavigate();
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);
    const handleOpen1 = () => {
        setIsOpen1((prevIsOpen1) => !prevIsOpen1);
        setIsOpen2(false);
        setIsOpen3(false);
        setIsOpen4(false);
    };

    const handleOpen2 = () => {
        setIsOpen2((prevIsOpen2) => !prevIsOpen2);
        setIsOpen1(false);
        setIsOpen3(false);
        setIsOpen4(false);
    };

    const handleOpen3 = () => {
        setIsOpen3((prevIsOpen3) => !prevIsOpen3);
        setIsOpen1(false);
        setIsOpen2(false);
        setIsOpen4(false);
    };

    const handleOpen4 = () => {
        setIsOpen4((prevIsOpen4) => !prevIsOpen4);
        setIsOpen1(false);
        setIsOpen2(false);
        setIsOpen3(false);
    };

    const handleGoToServicePage = () => {
        navigate('/service?role=ROLE_ADMIN');
    };
    const handleGoToServicePage2 = () => {
        navigate('/service');
    };
    return (
        <>
            {role === 'ROLE_ADMIN' ? (
                <section>
                    <aside className={cx('wrapper')}>
                        <button onClick={handleGoToServicePage}>Trang chủ</button>
                        <UserSidebar className={cx('user-sidebar')}>
                            Người dùng<button onClick={handleOpen1}>{isOpen1 ? 'up' : 'down'}</button>
                            {isOpen1 && (
                                <div className={cx('user-items')}>
                                    <UserProfile title="Thông tin người dùng" to={'/profile?role=ROLE_ADMIN'} />
                                    <LogOut title="Đăng xuất" to={'/'} />
                                </div>
                            )}
                        </UserSidebar>
                        <UserSidebar className={cx('department-sidebar')}>
                            phòng ban<button onClick={handleOpen2}>{isOpen2 ? 'up' : 'down'}</button>
                            {isOpen2 && (
                                <div className={cx('department-items')}>
                                    <UserProfile title="Thông tin phòng ban" to={'/service?role=ROLE_ADMIN'} />
                                </div>
                            )}
                        </UserSidebar>
                        <UserSidebar className={cx('category-sidebar')}>
                            danh mục<button onClick={handleOpen3}>{isOpen3 ? 'up' : 'down'}</button>
                            {isOpen3 && (
                                <div className={cx('category-items')}>
                                    <UserProfile title="danh mục" to={'/service'} />
                                </div>
                            )}
                        </UserSidebar>
                        <UserSidebar className={cx('coupon-sidebar')}>
                            phiếu<button onClick={handleOpen4}>{isOpen4 ? 'up' : 'down'}</button>
                            {isOpen4 && (
                                <div className={cx('coupon-items')}>
                                    <UserProfile title="Thông tin phiếu" to={'/service'} />
                                </div>
                            )}
                        </UserSidebar>
                    </aside>
                </section>
            ) : (
                <section>
                    <aside className={cx('wrapper')}>
                        <button onClick={handleGoToServicePage2}>Trang chủ</button>
                        <UserSidebar className={cx('user-sidebar')}>
                            Người dùng<button onClick={handleOpen1}>{isOpen1 ? 'up' : 'down'}</button>
                            {isOpen1 && (
                                <div className={cx('user-items')}>
                                    <UserProfile title="Thông tin người dùng" to={'/profile'} />
                                    <LogOut title="Đăng xuất" to={'/'} />
                                </div>
                            )}
                        </UserSidebar>
                    </aside>
                </section>
            )}
        </>
    );
}

export default Sidebar;
