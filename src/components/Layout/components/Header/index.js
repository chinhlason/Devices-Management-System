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
let NOTI_URL;
let READ_URL;
function Header() {
    const navigate = useNavigate();
    const roles = localStorage.getItem('role');
    const [isHaveNoti, setIsHaveNoti] = useState(false);
    const [noti, setNoti] = useState([]);
    const [isOpenNotiWrap, SetIsOpenNotiWrap] = useState(false);

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
    const role = localStorage.getItem('role');
    const [notiInfor, setNotiInfor] = useState([]);

    if (role === 'ROLE_ADMIN') {
        NOTI_URL = '/notification/admin/get-all-notification';
    } else {
        NOTI_URL = '/notification/get-all-notification';
    }

    const fetchData = () => {
        httpRequest
            .get(NOTI_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                console.log('checkerviet', data);
                setNotiInfor(data);
                const check = data.find((element) => {
                    return element.read === false;
                });
                console.log('co thong bao moi k', check);
                if (check !== undefined) {
                    setIsHaveNoti(true);
                } else {
                    setIsHaveNoti(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (data) => {
        if (role === 'ROLE_ADMIN') {
            READ_URL = `/notification/admin/read?id=${data}`;
        } else {
            READ_URL = `/notification/read?id=${data}`;
        }
        httpRequest
            .get(READ_URL, { withCredentials: true })
            .then((response) => {
                navigate('/notification');
                setIsHaveNoti(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };
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
                                <div>
                                    {notiInfor.length > 0 ? (
                                        <div className={cx('wrapper-2')}>
                                            {notiInfor.map((element, index) => (
                                                <div
                                                    className={cx('noti-contents', { bold: !element.read })}
                                                    onClick={(data) => {
                                                        SetIsOpenNotiWrap(false);
                                                        handleClick(element.id);
                                                    }}
                                                >
                                                    <div className={cx('info')}>
                                                        <div key={index}>
                                                            <h4 className={cx('name', { bold: !element.read })}>
                                                                {element.user}, lúc {element.createdAt}
                                                            </h4>
                                                            <p className={cx('content', { bold: !element.read })}>
                                                                {element.message}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>không có thông báo</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                >
                    <div className={cx('notiBell')}>
                        <div className={cx('noti-warn', { on: isHaveNoti })}>!</div>
                        <FontAwesomeIcon icon={faBell} onClick={() => SetIsOpenNotiWrap(!isOpenNotiWrap)} />
                    </div>
                </Tippy>
            </div>
        </header>
    );
}

export default Header;
