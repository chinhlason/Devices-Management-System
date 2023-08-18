import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import defautAvatar from '~/assets/images/Avatar-trang-den.png';
import styles from './NotificationItem.scss';
import React, { useEffect, useState } from 'react';
import httpRequest from '~/utils/htppRequest';
const cx = classNames.bind(styles);
let NOTI_URL;

function NotificationItem() {
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
                setNotiInfor(data);
                console.log('noti', data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {notiInfor.length > 0 ? (
                <div className={cx('wrapper')}>
                    {notiInfor.map((element, index) => (
                        <div>
                            <img className={cx('avatar')} src={defautAvatar} alt="avatar" />
                            <div className={cx('info')}>
                                <div key={index}>
                                    <h4 className={cx('name')}>
                                        {element.user}, lúc {element.createdAt}
                                    </h4>
                                    <p className={cx('content')}>{element.message}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>không có thông báo</p>
            )}
        </div>
    );
}

export default NotificationItem;
