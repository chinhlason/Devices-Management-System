import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './MenuSidebar.module.scss';
import httpRequest from '~/utils/htppRequest';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
const cx = classNames.bind(styles);
function LogOut({ title, to }) {
    const navigate = useNavigate();
    const handleClick = () => {
        httpRequest
            .post(
                '/auth/signout',
                {},
                {
                    withCredentials: true,
                },
            )
            .then((response) => {
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                localStorage.removeItem('fullname');
                localStorage.removeItem('birthDate');
                localStorage.removeItem('joinDate');
                localStorage.removeItem('tenVien');
                localStorage.removeItem('tenPhong');
                localStorage.removeItem('tenBan');
                localStorage.removeItem('phone');
                navigate('/');
            });
    };
    return (
        <NavLink className={cx('sidebar-option')} to={to} onClick={handleClick}>
            <span className={cx('title')}>{title}</span>
        </NavLink>
    );
}
export default LogOut;
