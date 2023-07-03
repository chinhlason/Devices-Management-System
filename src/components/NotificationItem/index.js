import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import defautAvatar from '~/assets/images/Avatar-trang-den.png';
import styles from './NotificationItem.scss';

const cx = classNames.bind(styles);

function NotificationItem() {
    return (
        <div className={cx('wrapper')}>
            <img className={cx('avatar')} src={defautAvatar} alt="avatar" />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>Nguyen Van A</span>
                </h4>
                <span className={cx('content')}>nguyenvana</span>
            </div>
        </div>
    );
}

export default NotificationItem;
