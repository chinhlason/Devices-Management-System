import React from 'react';
import { useForm, Controller, formState } from 'react-hook-form';
import Select from 'react-select';
import * as emailValidator from 'email-validator';
import httpRequest from '~/utils/htppRequest';
import { useNavigate } from 'react-router-dom';

const SIGN_UP_URL = '/auth/signup';
function SignUp() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    console.log(errors);
    const onSubmit = (data) => {
        const resquestData = {
            username: data.username,
            email: data.email,
            role: data.role.value,
            password: data.password,
            fullname: data.fullname,
            birthDate: data.birthDate,
            phone: data.phone,
            joinDate: data.joinDate,
            tenVien: data.tenVien,
            tenPhong: data.tenPhong,
            tenBan: data.tenBan,
        };
        console.log(resquestData);
        httpRequest
            .post(SIGN_UP_URL, resquestData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                console.log(response);
                alert('thanh cong');
                navigate('/profile');
            })
            .catch((err) => {
                console.log(err);
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
    return (
        <div>
            <header>TẠO TÀI KHOẢN NGƯỜI DÙNG</header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    placeholder="Tên tài khoản"
                    {...register('username', {
                        required: 'Vui lòng nhập tên tài khoản',
                        minLength: {
                            value: 6,
                            message: 'Tối thiểu 6 kí tự',
                        },
                    })}
                />
                <p>{errors.username?.message}</p>
                <input
                    placeholder="Mật khẩu"
                    type="password"
                    {...register('password', {
                        required: 'Vui lòng nhập mật khẩu',
                        minLength: {
                            value: 6,
                            message: 'Tối thiểu 6 kí tự',
                        },
                    })}
                />
                <p>{errors.password?.message}</p>
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={[
                                { value: ['admin'], label: 'ADMIN' },
                                { value: ['user'], label: 'Người dùng' },
                            ]}
                        />
                    )}
                />
                <input
                    placeholder="Tên người dùng"
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
                    type="email"
                    {...register('email', {
                        required: 'Vui lòng nhập Email',
                        validate: validateEmail,
                    })}
                />
                <p>{errors.email?.message}</p>

                <input
                    placeholder="Ngày sinh"
                    type="date"
                    {...register('birthDate', {
                        required: 'Vui lòng nhập ngày sinh',
                    })}
                />
                <p>{errors.birthDate?.message}</p>

                <input
                    placeholder="Số điện thoại"
                    type="number"
                    {...register('phone', {
                        required: 'Vui lòng nhập số điện thoại',
                        validate: validatePhone,
                    })}
                />
                <p>{errors.phone?.message}</p>

                <input
                    placeholder="Ngày tạo tài khoản"
                    type="date"
                    {...register('joinDate', {
                        required: 'Vui lòng nhập ngày tạo tài khoản',
                    })}
                />
                <p>{errors.joinDate?.message}</p>

                <input
                    placeholder="Tên viện"
                    {...register('tenVien', {
                        required: 'Vui lòng nhập tên Viện',
                    })}
                />
                <p>{errors.tenVien?.message}</p>

                <input
                    placeholder="Tên phòng"
                    {...register('tenPhong', {
                        required: 'Vui lòng nhập tên phòng',
                    })}
                />
                <p>{errors.tenPhong?.message}</p>

                <input
                    placeholder="Tên Ban"
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
export default SignUp;
