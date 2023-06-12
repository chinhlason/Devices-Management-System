import styles from './login.module.scss';
import classNames from 'classnames/bind';
import React, { useState, useRef, useEffect, useContext } from 'react';
import AuthContext from '~/context/AuthProvider';
import axios from '~/api/axios';

const cx = classNames.bind(styles);
const LOGIN_URL = '/signin';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const userRef = useRef();
    const errRef = useRef();
    const { setAuth } = useContext(AuthContext);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({ username, password }), {
                headers: {
                    'Content-Type': 'application/json', // Đổi Content-Type thành application/json
                    // Các header khác nếu cần thiết
                },
                withCredentials: true,
            });
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ username, password, roles, accessToken });
            setUsername('');
            setPassword('');
            setSuccess(true);
        } catch (err) {
            if (err.response?.httpStatusCode === 400) {
                setErrMsg('Sai tài khoản hoặc mật khẩu!');
            } else {
                setErrMsg('Đăng nhập không thành công');
            }
            errRef.current.focus();
        }
    };

    return (
        <>
            {success ? (
                <section>
                    <h1>Đăng nhập thành công</h1>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
                        {errMsg}
                    </p>
                    <div className={cx('wrapper')}>
                        <div className={cx('login-image')}></div>
                        <form onSubmit={handleSubmit}>
                            <div className={cx('login-box')}>
                                <header className={cx('login-box-header')}>ĐĂNG NHẬP</header>
                                <div className={cx('login-box-form')}>
                                    <input
                                        type="name"
                                        className={cx('username-box', 'text-box-login')}
                                        placeholder="Tên đăng nhập"
                                        id="username"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                        required
                                    ></input>
                                    <input
                                        type="password"
                                        className={cx('password-box', 'text-box-login')}
                                        placeholder="Mật khẩu"
                                        id="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        required
                                    ></input>
                                    <small className={cx('fail-noti')}></small>
                                </div>
                                <button className={cx('login-button')}>Đăng nhập</button>
                                <div className={cx('login-box-footer')}></div>
                            </div>
                        </form>
                    </div>
                </section>
            )}
        </>
    );
};
export default Login;
