import { useLocation } from 'react-router-dom';
import httpRequest from '~/utils/htppRequest';
import { useForm, Controller, formState } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const EXPORT_URL = '/phieuxuat/add';
const DEVICE_URL = '/device/list';
const USER_URL = '/user/list';
const UPDATE_URL = '/device/update?id=1';

function UpdateDevices() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serial = queryParams.get('serial');
    const [deviceInfor, setDeviceInfo] = useState('');
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    useEffect(() => {
        httpRequest
            .get(DEVICE_URL, { withCredentials: true })
            .then((response) => {
                const responseInfor = response.data.find(function (device) {
                    return device.serial === serial;
                });
                setDeviceInfo(responseInfor);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    const onSubmit = (data) => {
        const requestData = {
            name: data.name,
            serial: data.serial,
            price: data.price,
            warrantyTime: data.warrantyTime,
            maintenanceTime: data.maintenanceTime,
            categoryId: data.categoryId,
        };
        console.log(requestData);
        httpRequest
            .put(UPDATE_URL, requestData, { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                alert('Cập nhật thành công!');
                navigate('/service');
            })
            .catch((err) => {
                if (err.response?.status === 400) {
                    console.log(err);
                }
            });
    };

    const handleCancel = () => {
        navigate('/service');
    };
    return (
        <div>
            <header>THAY ĐỔI THÔNG TIN THIẾT BỊ</header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    placeholder="Tên thiết bị"
                    defaultValue={deviceInfor?.name}
                    {...register('name', {
                        required: 'Vui lòng nhập tên sản phẩm',
                        minLength: {
                            value: 3,
                            message: 'Tối thiểu 3 kí tự',
                        },
                    })}
                />
                <p>{errors.name?.message}</p>
                <input
                    placeholder="Serial"
                    defaultValue={deviceInfor?.serial}
                    {...register('serial', {
                        required: 'Vui lòng nhập Serial',
                    })}
                />
                <p>{errors.serial?.message}</p>

                <input
                    placeholder="Giá tiền"
                    defaultValue={deviceInfor?.price}
                    type="number"
                    {...register('price', {
                        required: 'Vui lòng nhập giá tiền',
                    })}
                />
                <p>{errors.price?.message}</p>

                <input
                    placeholder="Thời gian bảo hành"
                    defaultValue={deviceInfor?.warrantyTime}
                    type="number"
                    {...register('warrantyTime', {
                        required: 'Vui lòng nhập thời gian bảo hành',
                    })}
                />
                <p>{errors.warrantyTime?.message}</p>
                <input
                    placeholder="Chu kì bảo trì"
                    defaultValue={deviceInfor?.maintenanceTime}
                    type="number"
                    {...register('maintenanceTime', {
                        required: 'Vui lòng nhập chu kì bảo trì',
                    })}
                />
                <p>{errors.maintenanceTime?.message}</p>

                <input
                    placeholder="ID Danh mục"
                    defaultValue={deviceInfor?.categoryId}
                    type="number"
                    {...register('categoryId', {
                        required: 'Vui lòng nhập ID Danh mục',
                    })}
                />
                <p>{errors.categoryId?.message}</p>
                <input type="submit" />
            </form>
            <button type onClick={handleCancel}>
                Huỷ
            </button>
        </div>
    );
}

export default UpdateDevices;
