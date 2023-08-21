import { useLocation } from 'react-router-dom';
import httpRequest from '~/utils/htppRequest';
import * as emailValidator from 'email-validator';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import styles from './update.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const USER_URL = '/user/list';

function Update() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const [userInfor, setUserInfor] = useState({});

    useEffect(() => {
        getUserInformation();
    }, []);

    const getUserInformation = () => {
        httpRequest
            .get(USER_URL, { withCredentials: true })
            .then((user) => {
                const userInfor = user.data.find(function (user) {
                    return user.username === id;
                });
                setUserInfor(userInfor);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const requestData = {
            email: data.email || userInfor?.email,
            fullname: data.fullname || userInfor?.fullname,
            birthDate: data.birthDate || userInfor?.birthDate,
            phone: data.phone || userInfor?.phone,
            tenVien: data.tenVien || userInfor?.tenVien,
            tenPhong: data.tenPhong || userInfor?.tenPhong,
            tenBan: data.tenBan || userInfor?.tenBan,
        };
        httpRequest
            .put(`/user/update?username=${id}`, requestData, { withCredentials: true })
            .then((response) => {
                alert('Cập nhật thành công!');
                navigate('/profile');
            })
            .catch((err) => {
                if (err.response?.status === 400) {
                    console.log(err);
                }
            });
    };

    const validateEmail = (value) => {
        const emailToValidate = value || (userInfor && userInfor.email);
        if (!emailValidator.validate(emailToValidate)) {
            return 'Vui lòng nhập đúng Email';
        }
        return true;
    };

    const validatePhone = (value) => {
        const phoneToValidate = value || (userInfor && userInfor.phone);
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneToValidate)) {
            return 'Vui lòng nhập đúng số điện thoại';
        }
        return true;
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    return (
        <div>
            <div className={cx('back-ground-img')}></div>

            <div className={cx('wrapper')}>
                <h2>Thay đổi thông tin tài khoản</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={cx('form-boxs')}>
                    <input
                        className={cx('form-box')}
                        placeholder="Tên người dùng"
                        defaultValue={userInfor?.fullname}
                        {...register('fullname', {
                            minLength: {
                                value: 6,
                                message: 'Tối thiểu 6 kí tự',
                            },
                        })}
                    />
                    <p>{errors.fullname?.message}</p>
                    <input
                        className={cx('form-box')}
                        placeholder="Email"
                        defaultValue={userInfor?.email}
                        type="email"
                        {...register('email', {
                            validate: validateEmail,
                        })}
                    />
                    <p>{errors.email?.message}</p>
                    <input
                        className={cx('form-box')}
                        placeholder="Ngày sinh"
                        defaultValue={userInfor?.birthDate}
                        type="date"
                        {...register('birthDate')}
                    />
                    <p>{errors.birthDate?.message}</p>
                    <input
                        className={cx('form-box')}
                        placeholder="Số điện thoại"
                        defaultValue={userInfor?.phone}
                        type="number"
                        {...register('phone', {
                            validate: validatePhone,
                        })}
                    />
                    <p>{errors.phone?.message}</p>
                    <input
                        className={cx('form-box')}
                        placeholder="Tên viện"
                        defaultValue={userInfor?.tenVien}
                        {...register('tenVien')}
                    />
                    <p>{errors.tenVien?.message}</p>
                    <input
                        className={cx('form-box')}
                        placeholder="Tên phòng"
                        defaultValue={userInfor?.tenPhong}
                        {...register('tenPhong')}
                    />
                    <p>{errors.tenPhong?.message}</p>
                    <input
                        className={cx('form-box')}
                        placeholder="Tên Ban"
                        defaultValue={userInfor?.tenBan}
                        {...register('tenBan')}
                    />
                    <p>{errors.tenBan?.message}</p>
                    <Button className={cx('button-submit')} primary type="submit">
                        Gửi
                    </Button>
                </form>
                <Button className={cx('button-cancel')} primary onClick={handleCancel}>
                    Huỷ
                </Button>
            </div>
        </div>
    );
}

export default Update;
