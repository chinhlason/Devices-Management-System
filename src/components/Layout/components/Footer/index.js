import styles from './Footer.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('footer')}>
            <div className={cx('content')}>
                <p>Copyright &copy; Son&Thinh.</p>
            </div>
        </footer>
    );
}

export default Footer;
