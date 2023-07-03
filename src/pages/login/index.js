import styles from './login.module.scss';
import classNames from 'classnames/bind';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import httpRequest from '~/utils/htppRequest';
// import { BrowserRouter as Link } from 'react-router-dom';

const cx = classNames.bind(styles);
const LOGIN_URL = '/auth/signin';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const userRef = useRef();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    const handleSubmit = (e) => {
        e.preventDefault();

        httpRequest
            .post(
                LOGIN_URL,
                {
                    username,
                    password,
                },
                { withCredentials: true },
            )
            .then((response) => {
                console.log(response.data);
                setUsername('');
                setPassword('');
                setSuccess(true);
                if (response.data.roles[0] === 'ROLE_ADMIN') {
                    navigate(`/service`);
                } else {
                    navigate(`/mainpage`);
                }

                localStorage.setItem('role', `${response.data.roles[0]}`);
                localStorage.setItem('username', `${response.data.username}`);
                localStorage.setItem('email', `${response.data.email}`);
                localStorage.setItem('fullname', `${response.data.fullname}`);
                localStorage.setItem('birthDate', `${response.data.birthDate}`);
                localStorage.setItem('joinDate', `${response.data.joinDate}`);
                localStorage.setItem('tenVien', `${response.data.tenVien}`);
                localStorage.setItem('tenPhong', `${response.data.tenPhong}`);
                localStorage.setItem('tenBan', `${response.data.tenBan}`);
                localStorage.setItem('phone', `${response.data.phone}`);
            })
            .catch((err) => {
                if (err.response?.status === 400) {
                    setErrMsg('Sai tài khoản hoặc mật khẩu!');
                }
                errRef.current.focus();
            });
    };

    const handleForgot = () => {
        navigate('/resetpassword');
    };

    return (
        <>
            {success ? (
                <section>
                    <h1>Đăng nhập thành công</h1>
                </section>
            ) : (
                <section>
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
                                    <p
                                        ref={errRef}
                                        className={errMsg ? 'errmsg' : 'offscreen'}
                                        aria-live="assertive"
                                        style={{
                                            color: 'white',
                                            padding: 2,
                                        }}
                                    >
                                        {errMsg}
                                    </p>
                                </div>
                                <button type="submit" className={cx('login-button')}>
                                    Đăng nhập
                                </button>
                                <div className={cx('login-box-footer')}></div>
                                <button className={cx('button-forgot')} onClick={handleForgot}>
                                    Quên mật khẩu
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}
        </>
    );
};
export default Login;
