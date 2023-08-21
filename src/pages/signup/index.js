import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import * as emailValidator from 'email-validator';
import httpRequest from '~/utils/htppRequest';
import { useNavigate } from 'react-router-dom';

import styles from './signup.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const SIGN_UP_URL = '/auth/signup';
function SignUp() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        const resquestData = {
            username: data.username,
            email: data.email,
            role: data.role.value,
            password: data.password,
            fullname: data.fullname,
            birthDate: data.birthDate,
            phone: data.phone,
            tenVien: data.tenVien,
            tenPhong: data.tenPhong,
            tenBan: data.tenBan,
        };
        httpRequest
            .post(SIGN_UP_URL, resquestData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                alert('Tạo mới thành công');
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
            <div className={cx('back-ground-img')}></div>

            <div className={cx('wrapper')}>
                <h2>Tạo tài khoản</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={cx('form-boxs')}>
                    <small className={cx('error')}>
                        {errors.username?.message ||
                            errors.password?.message ||
                            errors.fullname?.message ||
                            errors.email?.message ||
                            errors.birthDate?.message ||
                            errors.tenVien?.message ||
                            errors.tenPhong?.message ||
                            errors.tenBan?.message}
                    </small>
                    <p>(*)</p>
                    <input
                        className={cx('form-box')}
                        placeholder="Tên tài khoản"
                        {...register('username', {
                            required: 'Vui lòng nhập đầy đủ thông tin',
                            minLength: {
                                value: 6,
                                message: 'Tối thiểu 6 kí tự',
                            },
                        })}
                    />
                    <p>(*)</p>

                    <input
                        className={cx('form-box')}
                        placeholder="Mật khẩu"
                        type="password"
                        {...register('password', {
                            required: 'Vui lòng nhập đầy đủ thông tin',
                            minLength: {
                                value: 6,
                                message: 'Tối thiểu 6 kí tự',
                            },
                        })}
                    />
                    <p>(*)</p>

                    <div className={cx('form-box-select')}>
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
                    </div>
                    <p>(*)</p>

                    <input
                        className={cx('form-box')}
                        placeholder="Tên người dùng"
                        {...register('fullname', {
                            required: 'Vui lòng nhập đầy đủ thông tin',
                            minLength: {
                                value: 6,
                                message: 'Tối thiểu 6 kí tự',
                            },
                        })}
                    />
                    <p>(*)</p>

                    <input
                        className={cx('form-box')}
                        placeholder="Email"
                        type="email"
                        {...register('email', {
                            required: 'Vui lòng nhập đầy đủ thông tin',
                            validate: validateEmail,
                        })}
                    />
                    <p>Ngày sinh (*)</p>
                    <input
                        className={cx('form-box')}
                        placeholder="Ngày sinh"
                        type="date"
                        {...register('birthDate', {
                            required: 'Vui lòng nhập đầy đủ thông tin',
                        })}
                    />
                    <p>(*)</p>

                    <input
                        className={cx('form-box')}
                        placeholder="Số điện thoại"
                        type="number"
                        {...register('phone', {
                            required: 'Vui lòng nhập đầy đủ thông tin',
                            validate: validatePhone,
                        })}
                    />
                    <p>(*)</p>

                    <input
                        className={cx('form-box')}
                        placeholder="Tên viện"
                        {...register('tenVien', {
                            required: 'Vui lòng nhập đầy đủ thông tin',
                        })}
                    />
                    <input className={cx('form-box')} placeholder="Tên phòng" {...register('tenPhong')} />
                    <input className={cx('form-box')} placeholder="Tên Ban" {...register('tenBan')} />
                    <Button className={cx('button-submit')} primary type="submit">
                        Gửi
                    </Button>

                    <Button
                        className={cx('button-cancel')}
                        primary
                        onClick={() => {
                            navigate('/profile');
                        }}
                    >
                        Quay lại
                    </Button>
                </form>
            </div>
        </div>
    );
}
export default SignUp;
