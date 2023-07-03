import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import httpRequest from '~/utils/htppRequest';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import styles from './profileUser.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

function ProfileUser() {
    const username = localStorage.getItem('username');
    const [isOpenMiniPage, setIsOpenMiniPage] = useState(false);
    const [userInfor, setUserInfor] = useState([]);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    useEffect(() => {
        console.log(12);
    }, []);

    const handleChangePassword = () => {
        setIsOpenMiniPage(true);
    };
    const handleCancel = () => {
        setIsOpenMiniPage(false);
        reset();
    };

    useEffect(() => {
        httpRequest
            .get(`/user?username=${username}`, { withCredentials: true })
            .then((response) => {
                const data = response.data; // Assuming the response is an array of objects
                setUserInfor(data);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const onSubmit = (data) => {
        console.log(data.oldPassword);
        console.log(data.newPassword);
        console.log(data.reNewPassword);

        if (data.newPassword === data.reNewPassword) {
            httpRequest
                .post(
                    `/changePassword?oldPassword=${data.oldPassword}&newPassword=${data.newPassword}`,
                    {},
                    {
                        withCredentials: true,
                    },
                )
                .then((response) => {
                    console.log(response.data);
                    alert('Cập nhật thành công!');
                    httpRequest
                        .post(
                            '/auth/signout',
                            {},
                            {
                                withCredentials: true,
                            },
                        )
                        .then((response) => {
                            localStorage.removeItem('role');
                            localStorage.removeItem('username');
                            localStorage.removeItem('email');
                            localStorage.removeItem('fullname');
                            localStorage.removeItem('birthDate');
                            localStorage.removeItem('joinDate');
                            localStorage.removeItem('tenVien');
                            localStorage.removeItem('tenPhong');
                            localStorage.removeItem('tenBan');
                            localStorage.removeItem('phone');
                        });
                    navigate('/');
                })
                .catch((err) => {
                    if (err.response?.status === 400) {
                        alert('mật khẩu cũ không chính xác');
                    }
                });
        } else {
            console.log('không trùng');
            alert('Mật khẩu mới không trùng khớp');
        }
    };
    return (
        <div>
            <div className={cx('back-ground-img')}></div>
            {!isOpenMiniPage ? (
                <div className={cx('wrapper')}>
                    <h1>Thông tin người dùng</h1>
                    <div className={cx('user-infor')}>
                        <p>Tên tài khoản : {userInfor.username}</p>
                        <p>Tên người dùng : {userInfor.fullname}</p>
                        <p>Vai trò : {userInfor.roles}</p>
                        <p>Email : {userInfor.email}</p>
                        <p>Ngày sinh : {userInfor.birthDate}</p>
                        <p>Số điện thoại : {userInfor.phone}</p>
                        <p>Ngày tạo tài khoản : {userInfor.joinDate}</p>
                        <p>Tên viện : {userInfor.tenVien}</p>
                        <p>Tên phòng : {userInfor.tenPhong}</p>
                        <p>Tên ban : {userInfor.tenBan}</p>
                        <Button className={cx('button-left')} primary onClick={handleChangePassword}>
                            Đổi mật khẩu
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={cx('wrapper')}>
                    <h1>Đổi mật khẩu</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={cx('form-boxs')}>
                            <input
                                className={cx('form-box')}
                                placeholder="Nhập mật khẩu hiện tại"
                                type="password"
                                {...register('oldPassword', {
                                    required: 'Vui lòng nhập mật khẩu',
                                })}
                            />
                            <p>{errors.oldPassword?.message}</p>
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
                        </div>
                        <Button className={cx('button-right')} primary type="submit">
                            Gửi
                        </Button>
                    </form>
                    <Button className={cx('button-left')} primary onClick={handleCancel}>
                        Huỷ
                    </Button>
                </div>
            )}
        </div>
    );
}

export default ProfileUser;
