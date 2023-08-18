import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import React, { useEffect, useState } from 'react';
import SideBarItem, { LogOut, SideBarOption } from './MenuSidebar';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import httpRequest from '~/utils/htppRequest';
import { useForm, Controller } from 'react-hook-form';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngle,
    faAngleUp,
    faAnglesDown,
    faAngleDown,
    faUser,
    faHouse,
    faBuildingUser,
    faDesktop,
    faPaperclip,
} from '@fortawesome/free-solid-svg-icons';

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
    const [isMainPage, setIsMainPage] = useState(false);
    const [categoryData, setCategoryData] = useState([]); // Thêm state mới để lưu trữ số lượng thiết bị
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const handleOpen1 = () => {
        setIsOpen1((prevIsOpen1) => !prevIsOpen1);
        setIsOpen2(false);
        setIsOpen3(false);
        setIsOpen4(false);
        setIsMainPage(false);
    };

    const handleOpen2 = () => {
        setIsOpen2((prevIsOpen2) => !prevIsOpen2);
        setIsOpen1(false);
        setIsOpen3(false);
        setIsOpen4(false);
        setIsMainPage(false);
    };

    const handleOpen3 = () => {
        setIsOpen3((prevIsOpen3) => !prevIsOpen3);
        setIsOpen1(false);
        setIsOpen2(false);
        setIsOpen4(false);
        setIsMainPage(false);
    };

    const handleOpen4 = () => {
        setIsOpen4((prevIsOpen4) => !prevIsOpen4);
        setIsOpen1(false);
        setIsOpen2(false);
        setIsOpen3(false);
        setIsMainPage(false);
    };

    const handleGoToServicePage = () => {
        setIsMainPage(!isMainPage);
        setIsOpen1(false);
        setIsOpen2(false);
        setIsOpen3(false);
        setIsOpen4(false);

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

    const onSubmit = (data) => {
        httpRequest
            .get(`/category/list`, { withCredentials: true })
            .then((response) => {
                const data_input = response.data;
                const input = data.input;

                const filteredDevices = data_input.filter((device) => device.name.includes(input));
                console.log('checked1', filteredDevices);
                if (filteredDevices.length > 0) {
                    console.log(filteredDevices[0].name);
                    navigate(`/categorydevice?category=${filteredDevices[0].name}`);
                } else {
                    alert('Không tìm thấy danh mục');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            {roles === 'ROLE_ADMIN' ? (
                <section>
                    <aside className={cx('wrapper')}>
                        <div className={cx('wrapper-mini')}>
                            <button
                                onClick={handleGoToServicePage}
                                className={cx('button-main-page', { 'bold-text': isMainPage })}
                            >
                                <div className={cx('icon-item')}>
                                    <FontAwesomeIcon icon={faHouse} />
                                </div>
                                Trang chủ
                            </button>

                            <SideBarItem className={cx('user-sidebar')}>
                                <div className={cx('option-sidebar', { 'bold-text': isOpen1 })} onClick={handleOpen1}>
                                    <div className={cx('icon-item')}>
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                    Người dùng
                                    <button className={cx('up-down-button')}>
                                        {isOpen1 ? (
                                            <FontAwesomeIcon icon={faAngleUp} />
                                        ) : (
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        )}
                                    </button>
                                </div>
                                <div className={cx('sidebar-items-user', { open: isOpen1 })}>
                                    <SideBarOption title="Thông tin người dùng" to={'/profileuser'} />
                                    <SideBarOption title="Danh sách người dùng" to={'/profile'} />
                                    <LogOut title="Đăng xuất" />
                                </div>
                            </SideBarItem>

                            <SideBarItem className={cx('department-sidebar')}>
                                <div className={cx('option-sidebar', { 'bold-text': isOpen2 })} onClick={handleOpen2}>
                                    <div className={cx('icon-item')}>
                                        <FontAwesomeIcon icon={faBuildingUser} />
                                    </div>
                                    Quản lý phòng ban
                                    <button className={cx('up-down-button')}>
                                        {isOpen2 ? (
                                            <FontAwesomeIcon icon={faAngleUp} />
                                        ) : (
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        )}
                                    </button>
                                </div>
                                <div className={cx('sidebar-items-department', { open: isOpen2 })}>
                                    <SideBarOption title="Thông tin phòng ban" to={'/department'} />
                                </div>
                            </SideBarItem>

                            <SideBarItem className={cx('category-sidebar')}>
                                <div className={cx('option-sidebar', { 'bold-text': isOpen3 })} onClick={handleOpen3}>
                                    <div className={cx('icon-item')}>
                                        <FontAwesomeIcon icon={faDesktop} />
                                    </div>
                                    Danh mục sản phẩm
                                    <button className={cx('up-down-button')}>
                                        {isOpen3 ? (
                                            <FontAwesomeIcon icon={faAngleUp} />
                                        ) : (
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        )}
                                    </button>
                                </div>
                                <ul className={cx('sidebar-items-category', { open: isOpen3 })}>
                                    <form onSubmit={handleSubmit(onSubmit)} className={cx('search')}>
                                        <div className={cx('form-search')}>
                                            <input
                                                placeholder="Tìm kiếm danh mục"
                                                {...register('input', {
                                                    required: 'Vui lòng nhập thông tin tìm kiếm',
                                                })}
                                            ></input>
                                        </div>
                                        <button type="submit" className={cx('search-btn')}>
                                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                                        </button>
                                    </form>
                                    {category.map((element, index) => {
                                        const matchedCategory = categoryData.find(
                                            (data) => data.categoryName === element.name,
                                        );
                                        const categoryLength = matchedCategory ? matchedCategory.length : 0;
                                        return (
                                            <div>
                                                <li key={index}>
                                                    <SideBarOption
                                                        title={element.name + ` (${categoryLength})`}
                                                        to={`/categorydevice?category=${element.name}`}
                                                    />
                                                </li>
                                            </div>
                                        );
                                    })}
                                </ul>
                            </SideBarItem>

                            <SideBarItem className={cx('coupon-sidebar')}>
                                <div className={cx('option-sidebar', { 'bold-text': isOpen4 })} onClick={handleOpen4}>
                                    <div className={cx('icon-item')}>
                                        <FontAwesomeIcon icon={faPaperclip} />
                                    </div>
                                    Thông tin phiếu
                                    <button className={cx('up-down-button')}>
                                        {isOpen4 ? (
                                            <FontAwesomeIcon icon={faAngleUp} />
                                        ) : (
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        )}
                                    </button>
                                </div>

                                <div>
                                    <div className={cx('sidebar-items-coupon', { open: isOpen4 })}>
                                        <SideBarOption title="Thông tin phiếu nhập" to={'/importcoupon'} />
                                        <SideBarOption title="Thông tin phiếu xuất" to={'/exportcoupon'} />
                                        <SideBarOption title="Thông tin phiếu bảo hành" to={'/warrantycoupon'} />
                                    </div>
                                </div>
                            </SideBarItem>
                        </div>
                    </aside>
                </section>
            ) : (
                <section>
                    <aside className={cx('wrapper')}>
                        <div className={cx('wrapper-mini')}>
                            <button
                                onClick={handleGoToServicePage2}
                                className={cx('button-main-page', { 'bold-text': isMainPage })}
                            >
                                <div className={cx('icon-item')}>
                                    <FontAwesomeIcon icon={faHouse} />
                                </div>
                                Trang chủ
                            </button>

                            <SideBarItem className={cx('user-sidebar')}>
                                <div className={cx('option-sidebar', { 'bold-text': isOpen1 })} onClick={handleOpen1}>
                                    <div className={cx('icon-item')}>
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                    Người dùng
                                    <button className={cx('up-down-button')}>
                                        {isOpen1 ? (
                                            <FontAwesomeIcon icon={faAngleUp} />
                                        ) : (
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        )}
                                    </button>
                                </div>
                                <div className={cx('sidebar-items-user', { open: isOpen1 })}>
                                    <SideBarOption title="Thông tin người dùng" to={'/profileuser'} />
                                    <LogOut title="Đăng xuất" />
                                </div>
                            </SideBarItem>

                            <SideBarItem className={cx('department-sidebar')}>
                                <div className={cx('option-sidebar', { 'bold-text': isOpen2 })} onClick={handleOpen2}>
                                    <div className={cx('icon-item')}>
                                        <FontAwesomeIcon icon={faBuildingUser} />
                                    </div>
                                    Quản lý thiết bị trong phòng ban
                                    <button className={cx('up-down-button')}>
                                        {isOpen2 ? (
                                            <FontAwesomeIcon icon={faAngleUp} />
                                        ) : (
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        )}
                                    </button>
                                </div>
                                <div className={cx('sidebar-items-department', { open: isOpen2 })}>
                                    <SideBarOption title="Danh sách thiết bị" to={'/devicebyusers'} />
                                    <SideBarOption title="Danh sách phiếu xuất về phòng ban" to={'/exportlistbyuser'} />
                                </div>
                            </SideBarItem>
                        </div>
                    </aside>
                </section>
            )}
        </>
    );
}

export default Sidebar;
