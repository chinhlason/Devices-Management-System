import React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import httpRequest from '~/utils/htppRequest';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { read, utils, writeFile } from 'xlsx';

import styles from './addDevice.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const PHIEU_NHAP_URL = '/phieunhap/add';
const AddDevice = () => {
    const navigate = useNavigate();
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
    const columnDefs = useMemo(
        () => [
            { field: 'name', headerName: 'TÊN THIẾT BỊ', filter: true },
            { field: 'serial', headerName: 'SERIAL', filter: true },
            { field: 'price', headerName: 'Giá tiền' },
            { field: 'warrantyTime', headerName: 'Thời hạn bảo hành', filter: true },
            { field: 'maintenanceTime', headerName: 'Chu kì bảo trì', filter: true },
            { field: 'categoryName', headerName: 'Danh mục', filter: true },
            { field: 'categoryDescription', headerName: 'Chi tiết sản phẩm', filter: true },
        ],
        [],
    );
    const defaultColDef = useMemo(
        () => ({
            sortable: true,
        }),
        [],
    );
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const [deviceList, setDeviceList] = useState([]);
    const [seller, setSeller] = useState({});
    const [confirmSeller, setConfirmSeller] = useState(false);

    const onSubmitSeller = ({ fullname, phone, companyName }) => {
        const data = {
            fullname,
            phone,
            companyName,
        };
        setSeller(data);
        setConfirmSeller(true);
    };
    const showSeller = (data) => {
        return (
            <div className={cx('seller-infor')}>
                <h2>Thông tin người bán</h2>
                <p>Tên người bán : {data.fullname}</p>
                <p>Số điện thoại : {data.phone}</p>
                <p>Công ty : {data.companyName}</p>
            </div>
        );
    };
    const handleSubmitDevice = ({
        name,
        serial,
        price,
        warrantyTime,
        maintenanceTime,
        categoryName,
        categoryDescription,
    }) => {
        const deviceData = {
            name,
            serial,
            price,
            warrantyTime,
            maintenanceTime,
            categoryName,
            categoryDescription,
        };
        setDeviceList((prevData) => [...prevData, deviceData]);
        reset({
            name: '',
            serial: '',
            price: 0,
            warrantyTime: 0,
            maintenanceTime: 0,
            categoryName: '',
            categoryDescription: '',
        });
        setRowData((prevData) => [...prevData, deviceData]);
    };

    const onSubmitAll = (e) => {
        e.preventDefault();
        const resquestData = {
            fullname: seller.fullname,
            phone: seller.phone,
            companyName: seller.companyName,
            devices: deviceList.map((device) => ({
                name: device.name,
                serial: device.serial,
                price: device.price,
                warrantyTime: device.warrantyTime,
                maintenanceTime: device.maintenanceTime,
                categoryName: device.categoryName,
                categoryDescription: device.categoryDescription,
            })),
        };
        console.log(resquestData);
        httpRequest
            .post(PHIEU_NHAP_URL, resquestData, { withCredentials: true })
            .then((response) => {
                console.log(response);
                alert('Tạo mới thành công');
                navigate('/service');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const cancelSubmit = () => {
        reset();
        setConfirmSeller(false);
        setDeviceList([]);
        setSeller({});
        navigate('/adddevice');
    };

    const validatePhone = (value) => {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
            return 'Vui lòng nhập đúng số điện thoại';
        }
        return true;
    };
    const handleImportFile = (event) => {
        console.log('File Import');
        const files = event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                const rows = utils.sheet_to_json(worksheet, {
                    header: [
                        'name',
                        'serial',
                        'price',
                        'warrantyTime',
                        'maintenanceTime',
                        'categoryName',
                        'categoryDescription',
                    ],
                    raw: true,
                });
                console.log('excel:');
                console.log(rows);
                setDeviceList(rows);
            };
            reader.readAsArrayBuffer(file);
        }
    };
    return (
        <form>
            {!confirmSeller ? (
                <div className={cx('wrapper')}>
                    <div className={cx('back-ground-img')}></div>
                    <div className={cx('form-submit-seller')}>
                        <div className={cx('form-submit-seller-content')}>
                            <h1>Tạo phiếu nhập</h1>

                            <h2 className={cx('mini-title')}>Nhập thông tin người bán</h2>
                            <div className={cx('form-boxs')}>
                                <input
                                    className={cx('form-box')}
                                    placeholder="Tên tài khoản"
                                    {...register('fullname', {
                                        required: 'Vui lòng nhập tên tài khoản',
                                        minLength: {
                                            value: 6,
                                            message: 'Tối thiểu 6 kí tự',
                                        },
                                    })}
                                />
                                <p>{errors.fullname?.message}</p>
                                <input
                                    className={cx('form-box')}
                                    placeholder="Số điện thoại"
                                    type="number"
                                    {...register('phone', {
                                        required: 'Vui lòng nhập số điện thoại',
                                        validate: validatePhone,
                                    })}
                                />
                                <p>{errors.phone?.message}</p>
                                <input
                                    className={cx('form-box')}
                                    placeholder="Tên công ty"
                                    {...register('companyName', {
                                        required: 'Vui lòng nhập tên công ty',
                                    })}
                                />
                                <p>{errors.companyName?.message}</p>
                            </div>
                            <Button
                                className={cx('button-next')}
                                primary
                                type="submit"
                                onClick={handleSubmit(onSubmitSeller)}
                            >
                                Tiếp theo
                            </Button>
                            <Button
                                className={cx('button-back')}
                                primary
                                onClick={() => {
                                    navigate('/service');
                                }}
                            >
                                Trở lại
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className={cx('wrapper-2')}>
                        <div className={cx('back-ground-img')}></div>
                        <div className={cx('input-box')}>
                            {showSeller(seller)}
                            <div className={cx('device-box')}>
                                <h2>NHẬP THÔNG TIN SẢN PHẨM</h2>
                                <div className={cx('form-device-box')}>
                                    <p>
                                        {errors.name?.message ||
                                            errors.serial?.message ||
                                            errors.price?.message ||
                                            errors.warrantyTime?.message ||
                                            errors.maintenanceTime?.message ||
                                            errors.categoryName?.message ||
                                            errors.categoryDescription?.message}
                                    </p>
                                    <input
                                        className={cx('form-box')}
                                        placeholder="Tên thiết bị"
                                        {...register('name', {
                                            required: 'Vui lòng nhập đủ thông tin thiết bị',
                                        })}
                                    />
                                    <input
                                        className={cx('form-box')}
                                        placeholder="Serial"
                                        {...register('serial', {
                                            required: 'Vui lòng nhập đủ thông tin thiết bị',
                                        })}
                                    />
                                    <input
                                        className={cx('form-box')}
                                        placeholder="Giá tiền"
                                        type="number"
                                        {...register('price', {
                                            required: 'Vui lòng nhập đủ thông tin thiết bị',
                                        })}
                                    />
                                    <input
                                        className={cx('form-box')}
                                        placeholder="Thời gian bảo hành"
                                        type="number"
                                        {...register('warrantyTime', {
                                            required: 'Vui lòng nhập đủ thông tin thiết bị',
                                        })}
                                    />
                                    <input
                                        className={cx('form-box')}
                                        placeholder="Chu kì bảo trì"
                                        type="number"
                                        {...register('maintenanceTime', {
                                            required: 'Vui lòng nhập đủ thông tin thiết bị',
                                        })}
                                    />
                                    <input
                                        className={cx('form-box')}
                                        placeholder="Tên danh mục"
                                        {...register('categoryName', {
                                            required: 'Vui lòng nhập đủ thông tin thiết bị',
                                        })}
                                    />
                                    <input
                                        className={cx('form-box')}
                                        placeholder="Chi tiết sản phẩm"
                                        {...register('categoryDescription', {
                                            required: 'Vui lòng nhập đủ thông tin thiết bị',
                                        })}
                                    />
                                    <Button
                                        className={cx('button-add')}
                                        primary
                                        type="submit"
                                        onClick={handleSubmit(handleSubmitDevice)}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            <div className={cx('input-file')}>
                                <h3>Nhập thiết bị bằng file</h3>
                                <input
                                    type="file"
                                    name="file"
                                    className="custom-file-input"
                                    id="inputGroupFile"
                                    required
                                    onChange={handleImportFile}
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                />
                            </div>
                            <Button className={cx('button-cancel')} primary onClick={cancelSubmit}>
                                Huỷ
                            </Button>
                            <Button className={cx('button-submit')} primary onClick={onSubmitAll}>
                                Tạo phiếu nhập
                            </Button>
                        </div>

                        <div className={cx('table')}>
                            <div className="ag-theme-alpine" style={{ width: 1400, height: 800, color: 'red' }}>
                                <h2>Bảng thiết bị nhập</h2>
                                <AgGridReact
                                    ref={gridRef}
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    defaultColDef={defaultColDef}
                                    animateRows={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};

export default AddDevice;
