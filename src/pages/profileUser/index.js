import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import httpRequest from '~/utils/htppRequest';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
function ProfileUser() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    const fullname = localStorage.getItem('fullname');
    const birthDate = localStorage.getItem('birthDate');
    const joinDate = localStorage.getItem('joinDate');
    const tenVien = localStorage.getItem('tenVien');
    const tenPhong = localStorage.getItem('tenPhong');
    const tenBan = localStorage.getItem('tenBan');
    const phone = localStorage.getItem('phone');
    const [isOpenMiniPage, setIsOpenMiniPage] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    useEffect(() => {
        console.log(12);
    }, []);

    const handleChangePassword = () => {
        setIsOpenMiniPage(true);
    };
    const handleCancel = () => {
        setIsOpenMiniPage(false);
    };

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
            {!isOpenMiniPage ? (
                <div>
                    <h1>Thông tin người dùng</h1>
                    <p>Tên tài khoản : {username}</p>
                    <p>Email : {email}</p>
                    <p>Tên người dùng : {fullname}</p>
                    <p>Ngày sinh : {birthDate}</p>
                    <p>Số điện thoại : {phone}</p>
                    <p>Ngày tạo tài khoản : {joinDate}</p>
                    <p>Tên viện : {tenVien}</p>
                    <p>Tên phòng : {tenPhong}</p>
                    <p>Tên ban : {tenBan}</p>
                    <p>Vai trò : {role}</p>
                    <button onClick={handleChangePassword}>Đổi mật khẩu</button>
                </div>
            ) : (
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            placeholder="Nhập mật khẩu hiện tại"
                            type="password"
                            {...register('oldPassword', {
                                required: 'Vui lòng nhập mật khẩu',
                            })}
                        />
                        <p>{errors.oldPassword?.message}</p>
                        <input
                            placeholder="Nhập mật khẩu mới"
                            type="password"
                            {...register('newPassword', {
                                required: 'Vui lòng nhập mật khẩu mới',
                            })}
                        />
                        <p>{errors.newPassword?.message}</p>
                        <input
                            placeholder="Nhập lại mật khẩu mới"
                            type="password"
                            {...register('reNewPassword', {
                                required: 'Vui lòng nhập lại mật khẩu',
                            })}
                        />
                        <p>{errors.reNewPassword?.message}</p>
                        <button type="submit">Gửi</button>
                    </form>
                    <button onClick={handleCancel}>Huỷ</button>
                </div>
            )}
        </div>
    );
}

export default ProfileUser;
