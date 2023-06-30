import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import React, { useEffect, useState } from 'react';
import UserSidebar, { LogOut, UserProfile } from './userSidebar';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import httpRequest from '~/utils/htppRequest';

const cx = classNames.bind(styles);
const CATEGORY_URL = '/category/list';

function Sidebar() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role');
    const roles = localStorage.getItem('role');
    const navigate = useNavigate();
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);
    const [isOpen5, setIsOpen5] = useState(false);
    const [category, setCategory] = useState([]);

    const [categoryData, setCategoryData] = useState([]); // Thêm state mới để lưu trữ số lượng thiết bị

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
        setIsOpen5(!isOpen5);
        navigate('/service');
    };

    const handleGoToServicePage2 = () => {
        navigate('/mainpage');
    };

    useEffect(() => {
        if (roles === 'ROLE_ADMIN') {
            httpRequest
                .get(CATEGORY_URL, { withCredentials: true })
                .then((response) => {
                    const data = response.data;
                    setCategory(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    const takeNumberdevice = (categoryName) => {
        httpRequest
            .get(`/device/list-by-category-name?categoryName=${categoryName}`, { withCredentials: true })
            .then((response) => {
                const data = response.data; // Giả sử phản hồi là một mảng các đối tượng
                setCategoryData((prevCategoryData) => [...prevCategoryData, { categoryName, length: data.length }]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        setCategoryData([]); // Reset dữ liệu số lượng thiết bị khi danh mục thay đổi
        category.forEach((element) => {
            takeNumberdevice(element.name); // Gọi hàm takeNumberdevice cho mỗi danh mục
        });
    }, [category]);

    return (
        <>
            {roles === 'ROLE_ADMIN' ? (
                <section>
                    <aside className={cx('wrapper')}>
                        <button onClick={handleGoToServicePage}>Trang chủ</button>
                        <UserSidebar className={cx('user-sidebar')}>
                            Người dùng<button onClick={handleOpen1}>{isOpen1 ? 'up' : 'down'}</button>
                            {isOpen1 && (
                                <div className={cx('user-items')}>
                                    <UserProfile title="Thông tin người dùng" to={'/profileuser'} />
                                    <UserProfile title="Danh sách người dùng" to={'/profile'} />
                                    <LogOut title="Đăng xuất" />
                                </div>
                            )}
                        </UserSidebar>
                        <UserSidebar className={cx('department-sidebar')}>
                            phòng ban<button onClick={handleOpen2}>{isOpen2 ? 'up' : 'down'}</button>
                            {isOpen2 && (
                                <div className={cx('department-items')}>
                                    <UserProfile title="Thông tin phòng ban" to={'/department'} />
                                </div>
                            )}
                        </UserSidebar>
                        <UserSidebar className={cx('category-sidebar')}>
                            danh mục<button onClick={handleOpen3}>{isOpen3 ? 'up' : 'down'}</button>
                            {isOpen3 && (
                                <ul>
                                    {category.map((element, index) => {
                                        const matchedCategory = categoryData.find(
                                            (data) => data.categoryName === element.name,
                                        );
                                        const categoryLength = matchedCategory ? matchedCategory.length : 0;
                                        return (
                                            <li key={index}>
                                                <UserProfile
                                                    title={element.name + ` (${categoryLength})`}
                                                    to={`/categorydevice?category=${element.name}`}
                                                />
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </UserSidebar>
                        <UserSidebar className={cx('coupon-sidebar')}>
                            phiếu<button onClick={handleOpen4}>{isOpen4 ? 'up' : 'down'}</button>
                            {isOpen4 && (
                                <div>
                                    <div className={cx('coupon-items')}>
                                        <UserProfile title="Thông tin phiếu nhập" to={'/importcoupon'} />
                                    </div>
                                    <div className={cx('coupon-items')}>
                                        <UserProfile title="Thông tin phiếu xuất" to={'/exportcoupon'} />
                                    </div>
                                    <div className={cx('coupon-items')}>
                                        <UserProfile title="Thông tin phiếu bảo hành" to={'/warrantycoupon'} />
                                    </div>
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
                                    <UserProfile title="Thông tin người dùng" to={'/profileuser'} />
                                    <LogOut title="Đăng xuất" to={'/'} />
                                </div>
                            )}
                        </UserSidebar>
                        <UserSidebar className={cx('user-sidebar')}>
                            Quản lý thiết bị trong phòng ban
                            <button onClick={handleOpen2}>{isOpen2 ? 'up' : 'down'}</button>
                            {isOpen2 && (
                                <div className={cx('user-items')}>
                                    <UserProfile title="Danh sách thiết bị" to={'/devicebyusers'} />
                                    <UserProfile title="Danh sách phiếu xuất về phòng ban" to={'/exportlistbyuser'} />
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
