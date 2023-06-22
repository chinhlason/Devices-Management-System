import { useLocation } from 'react-router-dom';
import httpRequest from '~/utils/htppRequest';
import { useForm, Controller, formState } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const EXPORT_URL = '/phieuxuat/add';
const DEVICE_URL = '/device/list';
const USER_URL = '/user/list';
function Export() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serial = queryParams.get('serial');
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const [deviceInfor, setDeviceInfo] = useState({});
    const [username, setUsername] = useState('');
    const [userInfor, setUserInfor] = useState({});

    const [isExist, setIsExist] = useState(false);

    useEffect(() => {
        getDeviceInformation();
    }, []);

    useEffect(() => {
        httpRequest
            .get(USER_URL, { withCredentials: true })
            .then((response) => {
                const responseInfor = response.data.find(function (device) {
                    return device.username === username;
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [username]);

    const getDeviceInformation = () => {
        httpRequest
            .get(DEVICE_URL, { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                const responseInfor = response.data.find(function (device) {
                    return device.serial === serial;
                });
                setDeviceInfo(responseInfor);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const onSubmit = (data) => {
        const username = data.username;
        console.log(username);
        httpRequest
            .get(USER_URL, { withCredentials: true })
            .then((response) => {
                const responseInfor = response.data.find(function (user) {
                    return user.username === username;
                });
                if (responseInfor !== undefined) {
                    setIsExist(true);
                    setUserInfor(responseInfor);
                    console.log(userInfor);
                } else {
                    setIsExist(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleExport = () => {
        const resquestData = {
            receiver: userInfor.username,
            devices: [deviceInfor.serial],
        };
        console.log(resquestData);
        httpRequest
            .post(EXPORT_URL, resquestData, { withCredentials: true })
            .then((response) => {
                console.log(response);
                alert('Tạo mới thành công');
                navigate('/service?role=ROLE_ADMIN');
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div>
            <h1>TẠO PHIẾU XUẤT</h1>
            <p>Tên thiết bị : {deviceInfor.name}</p>
            <p>Số Serial : {deviceInfor.serial}</p>
            <p>Giá : {deviceInfor.price}</p>
            <p>Thời hạn bảo hành : {deviceInfor.warrantyStatus}</p>
            <p>Chu kì bảo trì : {deviceInfor.warrantyTime}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    placeholder="Tên tài khoản người nhận"
                    {...register('username', {
                        required: 'Vui lòng nhập tên tài khoản',
                        minLength: {
                            value: 6,
                            message: 'Tối thiểu 6 kí tự',
                        },
                    })}
                />
                <p>{errors.username?.message}</p>
                <button type="submit">Kiểm tra người nhận</button>
                {isExist ? (
                    <div>
                        <p>Username: {userInfor.username}</p>
                        <p>Tên người nhận: {userInfor.fullname}</p>
                        <p>
                            Phòng, Ban, Viện: {userInfor.tenPhong}, {userInfor.tenVien}, {userInfor.tenBan}
                        </p>
                        <button onClick={handleExport}>Tạo phiếu xuất</button>
                    </div>
                ) : (
                    <p> Không tồn tại người dùng </p>
                )}
            </form>
        </div>
    );
}

export default Export;
