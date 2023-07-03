import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faMagnifyingGlass, faSpinner, faBell } from '@fortawesome/free-solid-svg-icons';
import httpRequest from '~/utils/htppRequest';
import NotificationItem from '~/components/NotificationItem';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';

const cx = classNames.bind(styles);

function Header() {
    const navigate = useNavigate();
    const roles = localStorage.getItem('role');
    const [isHaveNoti, setIsHaveNoti] = useState(false);
    const [noti, setNoti] = useState([]);
    const [isOpenNotiWrap, SetIsOpenNotiWrap] = useState(false);

    const handleGoToNoti = () => {
        navigate('/notification');
        setIsHaveNoti(false);
    };
    // useEffect(() => {
    //     const fetchData = () => {
    //         httpRequest
    //             .get(`/warrantycard/list-unconfirm`, { withCredentials: true })
    //             .then((response) => {
    //                 const data = response.data;
    //                 setNoti(data);

    //                 if (JSON.stringify(data) !== JSON.stringify(noti)) {
    //                     setIsHaveNoti(true);
    //                 }
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    //     };

    //     fetchData();

    //     const intervalId = setInterval(fetchData, 5000);

    //     return () => {
    //         clearInterval(intervalId);
    //     };
    // }, []);
    console.log(isOpenNotiWrap);
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <img
                    onClick={() => {
                        navigate('/service');
                    }}
                    src="https://storage.googleapis.com/hust-files/5807675312963584/images/hust-logo-official_.3m.jpeg"
                    alt="logo"
                    className={cx('image-logo')}
                ></img>
                <div className={cx('search')}>
                    <input type="name" placeholder="Tìm kiếm" spellCheck={false} />
                    <button className={cx('clear')}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                    <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />
                    <button className={cx('search-btn')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>

                <Tippy
                    placement="bottom-end"
                    visible={isOpenNotiWrap}
                    onClickOutside={() => {
                        SetIsOpenNotiWrap(false);
                    }}
                    interactive
                    render={(attrs) => (
                        <div className={cx('noti-content')} tabIndex="-1" {...attrs}>
                            <div>
                                <h4 className={cx('noti-content-header')}>Thông báo</h4>
                                <div
                                    onClick={() => {
                                        navigate('/notification');
                                    }}
                                >
                                    <NotificationItem />
                                </div>
                                <NotificationItem />
                                <NotificationItem />
                                <NotificationItem />
                            </div>
                        </div>
                    )}
                >
                    <div className={cx('notiBell')}>
                        <FontAwesomeIcon icon={faBell} onClick={() => SetIsOpenNotiWrap(!isOpenNotiWrap)} />
                    </div>
                </Tippy>
            </div>
        </header>
    );
}

export default Header;
