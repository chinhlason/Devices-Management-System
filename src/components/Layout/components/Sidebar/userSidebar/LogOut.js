import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../Sidebar.module.scss';
import httpRequest from '~/utils/htppRequest';
import { memo } from 'react';
const cx = classNames.bind(styles);
function LogOut({ title, to }) {
    const handleClick = () => {
        httpRequest
            .post(
                '/auth/signout',
                {},
                {
                    withCredentials: true,
                },
            )
            .then((response) => {});
    };
    return (
        <NavLink className={cx('user-profile')} to={to} onClick={handleClick}>
            <span className={cx('title')}>{title}</span>
        </NavLink>
    );
}
export default LogOut;
