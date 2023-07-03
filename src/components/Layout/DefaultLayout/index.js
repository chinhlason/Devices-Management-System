import styles from './DefaultLayout.module.scss';
import Header from '~/components/Layout/components/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import classNames from 'classnames/bind';
import Footer from '../components/Footer';
const cx = classNames.bind(styles);

function defaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <Sidebar />
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default defaultLayout;
