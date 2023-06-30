import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../Sidebar.module.scss';
const cx = classNames.bind(styles);
function CategorySidebar({ title, to }) {
    return (
        <NavLink className={cx('category')} to={to}>
            <span className={cx('title')}>{title}</span>
        </NavLink>
    );
}
export default CategorySidebar;
