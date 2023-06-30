import { useLocation } from 'react-router-dom';
import httpRequest from '~/utils/htppRequest';
import * as emailValator from 'email-validator';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const WARRANTY_URL = '/warrantycard/list';
const USER_URL = '/user/list';

function HandOver() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serial = queryParams.get('serial');
    const username = localStorage.getItem('username');
    console.log(username);
    console.log(serial);
    const [warrantyData, setWarrantyData] = useState([]);
    const [showData, setShowData] = useState([]);
    const [showDataUser, setShowDataUser] = useState([]);

    useEffect(() => {
        httpRequest
            .get(WARRANTY_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data; // Assuming the response is an array of objects
                console.log(data);
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
            console.log(dataSend);
            setShowData(dataSend);
        }
    }, [warrantyData]);

    const handleHandOver = () => {
        httpRequest
            .get(`/warrantycard/transfer?id=${showData[0].id}&price=${showData[0].device.price}`, {
                withCredentials: true,
            })
            .then((response) => {
                console.log('sda', response.data);
                alert('Bàn giao thành công');
                navigate('/service');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    console.log('ssss', showData[0]);
    useEffect(() => {
        if (showData.length > 0) {
            httpRequest
                .get(`/user?username=${showData[0].receiver}`, { withCredentials: true })
                .then((response) => {
                    console.log('sda', response.data);
                    setShowDataUser(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [showData]);
    console.log('ssds', showDataUser);
    return (
        <div>
            <h1>BÀN GIAO THIẾT BỊ</h1>
            {showData.length > 0 ? (
                <>
                    <h2>Thông tin trạng thái thiết bị</h2>
                    <p>Tên thiết bị: {showData[0].device.name}</p>
                    <p>Serial: {showData[0].device.serial}</p>
                    <p>Giá tiền: {showData[0].device.price}</p>
                    <p>Thời gian bảo hành: {showData[0].device.warrantyTime}</p>
                    <p>Chu kỳ bảo trì: {showData[0].device.maintenanceTime}</p>
                    <p>Trạng thái xuất: {showData[0].device.status}</p>
                    <p>Trạng thái bảo hành: {showData[0].device.warrantyStatus}</p>
                    <p>Trạng thái bảo trì: {showData[0].device.maintenanceStatus}</p>
                    <h2>Thông tin người bàn giao</h2>
                    <p>
                        Người nhận: {showData[0].receiver}, thuộc Phòng : {showDataUser.tenPhong}, Ban :{' '}
                        {showDataUser.tenBan}, Viện : {showDataUser.tenVien}
                    </p>

                    <p>Người xác nhận : {showData[0].confirmer}</p>

                    <button onClick={handleHandOver}>Bàn giao</button>
                </>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
}

export default HandOver;
