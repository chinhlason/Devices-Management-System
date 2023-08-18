import { useLocation } from 'react-router-dom';
import httpRequest from '~/utils/htppRequest';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import styles from './updateDevice.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const DEVICE_URL = '/device/list';
const UPDATE_URL = '/device/update?id=1';

function UpdateDevices() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    console.log('id in', typeof id);
    const [deviceInfor, setDeviceInfo] = useState('');
    const history = createBrowserHistory();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    useEffect(() => {
        httpRequest
            .get(DEVICE_URL, { withCredentials: true })
            .then((response) => {
                const responseInfor = response.data.find(function (device) {
                    console.log('id', typeof device.id);
                    return device.id == id;
                });
                console.log('kq', responseInfor);
                setDeviceInfo(responseInfor);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    const onSubmit = (data) => {
        console.log('data-check', data);
        const requestData = {
            name: data.name || deviceInfor?.name,
            serial: data.serial || deviceInfor?.serial,
            price: data.price || deviceInfor?.price,
            warrantyTime: data.warrantyTime || deviceInfor?.warrantyTime,
            maintenanceTime: data.maintenanceTime || deviceInfor?.maintenanceTime,
            categoryId: data.categoryId || deviceInfor?.categoryId,
        };
        console.log(requestData);
        httpRequest
            .put(`/device/update?id=${id}`, requestData, { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                alert('Cập nhật thành công!');
                history.back();
            })
            .catch((err) => {
                if (err.response?.status === 400) {
                    console.log(err);
                }
            });
    };

    return (
        <div>
            <div className={cx('back-ground-img')}></div>

            <div className={cx('wrapper')}>
                <h2>Thay đổi thông tin thiết bị</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={cx('form-boxs')}>
                    <input
                        className={cx('form-box')}
                        placeholder="Tên thiết bị"
                        defaultValue={deviceInfor?.name}
                        {...register('name', {
                            minLength: {
                                value: 3,
                                message: 'Tối thiểu 3 kí tự',
                            },
                        })}
                    />
                    <p>{errors.name?.message}</p>
                    <input
                        className={cx('form-box')}
                        placeholder="Serial"
                        defaultValue={deviceInfor?.serial}
                        {...register('serial', {})}
                    />
                    <p>{errors.serial?.message}</p>
                    <input
                        className={cx('form-box')}
                        placeholder="Giá tiền"
                        defaultValue={deviceInfor?.price}
                        type="number"
                        {...register('price', {})}
                    />
                    <p>{errors.price?.message}</p>
                    <input
                        className={cx('form-box')}
                        placeholder="Thời gian bảo hành"
                        defaultValue={deviceInfor?.warrantyTime}
                        type="number"
                        {...register('warrantyTime', {})}
                    />
                    <p>{errors.warrantyTime?.message}</p>
                    <input
                        className={cx('form-box')}
                        placeholder="Chu kì bảo trì"
                        defaultValue={deviceInfor?.maintenanceTime}
                        type="number"
                        {...register('maintenanceTime', {})}
                    />
                    <p>{errors.maintenanceTime?.message}</p>
                    <input
                        className={cx('form-box')}
                        placeholder="ID Danh mục"
                        defaultValue={deviceInfor?.categoryId}
                        type="number"
                        {...register('categoryId', {})}
                    />
                    <p>{errors.categoryId?.message}</p>
                    <Button className={cx('button-submit')} primary type="submit">
                        Gửi
                    </Button>
                </form>
                <Button
                    className={cx('button-cancel')}
                    primary
                    type
                    onClick={() => {
                        history.back();
                    }}
                >
                    Huỷ
                </Button>
            </div>
        </div>
    );
}

export default UpdateDevices;
