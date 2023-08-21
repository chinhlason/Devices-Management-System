import { useLocation } from 'react-router-dom';
import httpRequest from '~/utils/htppRequest';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import styles from './handOver.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const WARRANTY_URL = '/warrantycard/list';

function HandOver() {
    const navigate = useNavigate();
    const location = useLocation();
    const history = createBrowserHistory();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const queryParams = new URLSearchParams(location.search);
    const serial = queryParams.get('serial');
    const [warrantyData, setWarrantyData] = useState([]);
    const [showData, setShowData] = useState([]);
    const [showDataUser, setShowDataUser] = useState([]);

    useEffect(() => {
        httpRequest
            .get(WARRANTY_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data; // Assuming the response is an array of objects
                setWarrantyData(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        const dataSend = warrantyData.filter(
            (element) => element.status === 'DANG_BAO_HANH' && element.device.serial === serial,
        );
        if (dataSend.length > 0) {
            setShowData(dataSend);
        }
    }, [warrantyData]);

    useEffect(() => {
        if (showData.length > 0) {
            httpRequest
                .get(`/user?username=${showData[0].receiver}`, { withCredentials: true })
                .then((response) => {
                    setShowDataUser(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [showData]);
    const onSubmit = (data) => {
        httpRequest
            .get(`/warrantycard/transfer?id=${showData[0].id}&price=${data.input}`, {
                withCredentials: true,
            })
            .then((response) => {
                alert('Bàn giao thành công');
                navigate('/service');
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('back-ground-img')}></div>

            {showData.length > 0 ? (
                <>
                    <Button
                        primary
                        className={cx('cancel-btn')}
                        onClick={() => {
                            history.back();
                        }}
                    >
                        X
                    </Button>
                    <h1>BÀN GIAO THIẾT BỊ</h1>
                    <div className={cx('device-block')}>
                        <h2>Thông tin trạng thái thiết bị</h2>
                        <p>Tên thiết bị: {showData[0].device.name}</p>
                        <p>Serial: {showData[0].device.serial}</p>
                        <p>Giá tiền: {showData[0].device.price}</p>
                        <p>Thời gian bảo hành: {showData[0].device.warrantyTime}</p>
                        <p>Chu kỳ bảo trì: {showData[0].device.maintenanceTime}</p>
                        <p>Trạng thái xuất: {showData[0].device.status}</p>
                        <p>Trạng thái bảo hành: {showData[0].device.warrantyStatus}</p>
                        <p>Trạng thái bảo trì: {showData[0].device.maintenanceStatus}</p>
                    </div>
                    <div className={cx('coupon-block')}>
                        <h2>Thông tin người bàn giao</h2>
                        <p>
                            Người nhận: {showData[0].receiver}, thuộc Phòng : {showDataUser.tenPhong}, Ban :{' '}
                            {showDataUser.tenBan}, Viện : {showDataUser.tenVien}
                        </p>
                        <p>Người xác nhận : {showData[0].confirmer}</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input
                                className={cx('form-box')}
                                placeholder="Chi phí bảo hành"
                                {...register('input', {
                                    required: 'Vui lòng nhập chi phí bảo hành',
                                })}
                            ></input>
                            <p className={cx('error')}>{errors.input?.message}</p>

                            <Button primary type="submit" className={cx('submit-btn')}>
                                Bàn giao
                            </Button>
                        </form>
                    </div>
                </>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
}

export default HandOver;
