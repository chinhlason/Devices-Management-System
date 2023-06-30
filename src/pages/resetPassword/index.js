import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as emailValidator from 'email-validator';
import httpRequest from '~/utils/htppRequest';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
            {token !== null ? (
                <div>
                    {access ? (
                        <div>
                            <h1>Đặt lại mật khẩu</h1>
                            <form onSubmit={handleSubmit(onSubmitNewPass)}>
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
                        </div>
                    ) : (
                        <div>
                            <h1>ĐƯỜNG DẪN HẾT HẠN hehe</h1>
                            <button
                                onClick={() => {
                                    navigate('/resetpassword');
                                }}
                            >
                                Về trang nhập email
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            placeholder="Email khôi phục"
                            type="email"
                            {...register('email', {
                                required: 'Vui lòng nhập Email',
                                validate: validateEmail,
                            })}
                        />
                        <p>{errors.email?.message}</p>
                        <button type="submit">Gửi</button>
                    </form>
                    <button
                        onClick={() => {
                            navigate('/');
                        }}
                    >
                        Huỷ
                    </button>
                </div>
            )}
        </>
    );
}

export default ResetPassword;
