import { useLocation } from 'react-router-dom';
import httpRequest from '~/utils/htppRequest';
import * as emailValidator from 'email-validator';
import React, { useState, useEffect } from 'react';
import { useForm, Controller, formState } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
const USER_URL = '/user/list';

function Update() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    console.log(id);

    const [userInfor, setUserInfor] = useState([]);

    useEffect(() => {
        getUserInformation();
    }, []);

    const getUserInformation = () => {
        httpRequest
            .get(USER_URL, { withCredentials: true })
            .then((user) => {
                console.log(user.data);
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
        control,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const requestData = {
            email: data.email,
            fullname: data.fullname,
            birthDate: data.birthDate,
            phone: data.phone,
            tenVien: data.tenVien,
            tenPhong: data.tenPhong,
            tenBan: data.tenBan,
        };
        console.log(requestData);
        httpRequest
            .put(`/user/update?username=${id}`, requestData, { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                alert('Cập nhật thành công!');
                navigate('/profile?role=ROLE_ADMIN');
            })
            .catch((err) => {
                if (err.response?.status === 400) {
                    console.log(err);
                }
            });
    };
    const validateEmail = (value) => {
        if (!emailValidator.validate(value)) {
            return 'Vui lòng nhập đúng Email';
        }
        return true;
    };
    const validatePhone = (value) => {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
            return 'Vui lòng nhập đúng số điện thoại';
        }
        return true;
    };
    console.log(userInfor.username);
    return (
        <div>
            <header>THAY ĐỔI THÔNG TIN TÀI KHOẢN</header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    placeholder="Tên người dùng"
                    defaultValue={userInfor?.fullname}
                    {...register('fullname', {
                        required: 'Vui lòng nhập tên người dùng',
                        minLength: {
                            value: 6,
                            message: 'Tối thiểu 6 kí tự',
                        },
                    })}
                />
                <p>{errors.fullname?.message}</p>
                <input
                    placeholder="Email"
                    defaultValue={userInfor?.email}
                    type="email"
                    {...register('email', {
                        required: 'Vui lòng nhập Email',
                        validate: validateEmail,
                    })}
                />
                <p>{errors.email?.message}</p>

                <input
                    placeholder="Ngày sinh"
                    defaultValue={userInfor?.birthDate}
                    type="date"
                    {...register('birthDate', {
                        required: 'Vui lòng nhập ngày sinh',
                    })}
                />
                <p>{errors.birthDate?.message}</p>

                <input
                    placeholder="Số điện thoại"
                    defaultValue={userInfor?.phone}
                    type="number"
                    {...register('phone', {
                        required: 'Vui lòng nhập số điện thoại',
                        validate: validatePhone,
                    })}
                />
                <p>{errors.phone?.message}</p>
                <input
                    placeholder="Tên viện"
                    defaultValue={userInfor?.tenVien}
                    {...register('tenVien', {
                        required: 'Vui lòng nhập tên Viện',
                    })}
                />
                <p>{errors.tenVien?.message}</p>

                <input
                    placeholder="Tên phòng"
                    defaultValue={userInfor?.tenPhong}
                    {...register('tenPhong', {
                        required: 'Vui lòng nhập tên phòng',
                    })}
                />
                <p>{errors.tenPhong?.message}</p>

                <input
                    placeholder="Tên Ban"
                    defaultValue={userInfor?.tenBan}
                    {...register('tenBan', {
                        required: 'Vui lòng nhập tên Ban',
                    })}
                />
                <p>{errors.tenBan?.message}</p>
                <input type="submit" />
            </form>
        </div>
    );
}

export default Update;
