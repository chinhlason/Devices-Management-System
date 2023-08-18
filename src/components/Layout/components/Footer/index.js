import styles from './Footer.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faMagnifyingGlass, faSpinner, faBell } from '@fortawesome/free-solid-svg-icons';
import httpRequest from '~/utils/htppRequest';
import NotificationItem from '~/components/NotificationItem';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';

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
