import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './MenuSidebar.module.scss';
const cx = classNames.bind(styles);
function SideBarOption({ title, to, icon }) {
    return (
        <NavLink className={cx('sidebar-option')} to={to}>
            <span className={cx('icon')}>{icon}</span>
            <span className={cx('title')}>{title}</span>
        </NavLink>
    );
}
export default SideBarOption;
