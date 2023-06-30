import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import httpRequest from '~/utils/htppRequest';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function Header() {
    const navigate = useNavigate();
    const roles = localStorage.getItem('role');
    console.log(roles);
    const [isHaveNoti, setIsHaveNoti] = useState(false);
    const [noti, setNoti] = useState([]);
    const handleGoToNoti = () => {
        navigate('/notification');
        setIsHaveNoti(false);
    };
    useEffect(() => {
        const fetchData = () => {
            httpRequest
                .get(`/warrantycard/list-unconfirm`, { withCredentials: true })
                .then((response) => {
                    const data = response.data;
                    setNoti(data);

                    if (JSON.stringify(data) !== JSON.stringify(noti)) {
                        setIsHaveNoti(true);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <img
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
                <select className={'select'} name="optionValues">
                    <option value>Tìm kiếm theo</option>
                    <option value="1">1</option>
                </select>
                <div className={cx('action')}></div>

                {roles === 'ROLE_ADMIN' ? (
                    <div>
                        {isHaveNoti ? (
                            <button onClick={handleGoToNoti}>Thông báo(!)</button>
                        ) : (
                            <button onClick={handleGoToNoti}>Thông báo</button>
                        )}
                    </div>
                ) : (
                    <p>d</p>
                )}
            </div>
        </header>
    );
}

export default Header;
