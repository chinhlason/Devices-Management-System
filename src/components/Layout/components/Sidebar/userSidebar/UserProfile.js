import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../Sidebar.module.scss';
const cx = classNames.bind(styles);
function UserProfile({ title, to }) {
    return (
        <NavLink className={cx('user-profile')} to={to}>
            <span className={cx('title')}>{title}</span>
        </NavLink>
    );
}
export default UserProfile;
