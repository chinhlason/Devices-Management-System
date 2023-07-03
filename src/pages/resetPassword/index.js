import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as emailValidator from 'email-validator';
import httpRequest from '~/utils/htppRequest';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import styles from './resetPassword.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

function ResetPassword() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const validateEmail = (value) => {
        if (!emailValidator.validate(value)) {
            return 'Vui lòng nhập đúng Email';
        }
        return true;
    };
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    console.log(token);
    const [access, setAccess] = useState(false);
    const onSubmit = (data) => {
        console.log(1);
        httpRequest
            .post(
                `/resetPassword?email=${data.email}`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then((response) => {
                console.log(response);
                alert('Gửi thành công! Kiểm tra email của bạn');
            })
            .catch((err) => {
                console.log(err);
                alert('Email lỗi');
            });
    };
    useEffect(() => {
        if (token !== null) {
            httpRequest
                .get(`/verifyToken?token=${token}`, { withCredentials: true })
                .then((response) => {
                    const data = response.data;
                    setAccess(true);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    const onSubmitNewPass = (data) => {
        if (data.newPassword === data.reNewPassword) {
            const dataSend = {
                token: token,
                newPassword: data.newPassword,
            };
            httpRequest
                .post(`/savePassword`, dataSend, {
                    withCredentials: true,
                })
                .then((response) => {
                    console.log(response.data);
                    alert('Cập nhật thành công!');
                    navigate('/');
                })
                .catch((err) => {
                    console.log(err);
                    alert('Lỗi');
                    navigate('/resetpassword');
                });
        } else {
            console.log('không trùng');
            alert('Mật khẩu mới không trùng khớp');
        }
    };
    return (
        <>
            <>
                <div className={cx('back-ground-img')}></div>

                <div className={cx('wrapper-3')}>
                    {token !== null ? (
                        <div>
                            {access ? (
                                <div>
                                    <h1>Đặt lại mật khẩu</h1>
                                    <form onSubmit={handleSubmit(onSubmitNewPass)}>
                                        <input
                                            className={cx('form-box')}
                                            placeholder="Nhập mật khẩu mới"
                                            type="password"
                                            {...register('newPassword', {
                                                required: 'Vui lòng nhập mật khẩu mới',
                                            })}
                                        />
                                        <p>{errors.newPassword?.message}</p>
                                        <input
                                            className={cx('form-box')}
                                            placeholder="Nhập lại mật khẩu mới"
                                            type="password"
                                            {...register('reNewPassword', {
                                                required: 'Vui lòng nhập lại mật khẩu',
                                            })}
                                        />
                                        <p>{errors.reNewPassword?.message}</p>
                                        <Button outline type="submit">
                                            Gửi
                                        </Button>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <h1 className={cx('link-broke')}>ĐƯỜNG DẪN HẾT HẠN </h1>
                                    <Button
                                        className={cx('button-back')}
                                        primary
                                        onClick={() => {
                                            navigate('/resetpassword');
                                        }}
                                    >
                                        Về trang nhập email
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <form onSubmit={handleSubmit(onSubmit)} className={cx('form-box-submit')}>
                                <h2>Đặt lại mật khẩu </h2>
                                <input
                                    className={cx('form-box-custom')}
                                    placeholder="Email khôi phục"
                                    type="email"
                                    {...register('email', {
                                        required: 'Vui lòng nhập Email',
                                        validate: validateEmail,
                                    })}
                                />
                                <p>{errors.email?.message}</p>
                                <Button className={cx('button-submit')} outline type="submit">
                                    Gửi
                                </Button>
                            </form>
                            <Button
                                className={cx('button-cancel')}
                                outline
                                onClick={() => {
                                    navigate('/');
                                }}
                            >
                                Huỷ
                            </Button>
                        </div>
                    )}
                </div>
            </>
        </>
    );
}

export default ResetPassword;
