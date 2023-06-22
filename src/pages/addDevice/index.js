import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import httpRequest from '~/utils/htppRequest';
import { read, utils, writeFile } from 'xlsx';
const PHIEU_NHAP_URL = '/phieunhap/add';
const AddDevice = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const [deviceList, setDeviceList] = useState([]);
    const [seller, setSeller] = useState({});
    const [confirmSeller, setConfirmSeller] = useState(false);
    useEffect(() => {
        console.log(deviceList);
    }, [deviceList]);
    useEffect(() => {
        console.log(seller);
    }, [seller]);
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
            <div>
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
        httpRequest
            .post(PHIEU_NHAP_URL, resquestData, { withCredentials: true })
            .then((response) => {
                console.log(response);
                alert('Tạo mới thành công');
                navigate('/service?role=ROLE_ADMIN');
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
        navigate('/adddevice/?role=ROLE_ADMIN');
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
                <div>
                    <h2>Nhập thông tin người bán</h2>
                    <input
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
                        placeholder="Số điện thoại"
                        type="number"
                        {...register('phone', {
                            required: 'Vui lòng nhập số điện thoại',
                            validate: validatePhone,
                        })}
                    />
                    <p>{errors.phone?.message}</p>
                    <input
                        placeholder="Tên công ty"
                        {...register('companyName', {
                            required: 'Vui lòng nhập tên công ty',
                        })}
                    />
                    <p>{errors.companyName?.message}</p>
                    <button type="submit" onClick={handleSubmit(onSubmitSeller)}>
                        Nhập người bán
                    </button>
                </div>
            ) : (
                <div>
                    {showSeller(seller)}
                    <h2>NHẬP THÔNG TIN SẢN PHẨM</h2>
                    <div>
                        <input
                            placeholder="Tên thiết bị"
                            {...register('name', {
                                required: 'Vui lòng nhập tên thiết bị',
                            })}
                        />
                        <p>{errors.name?.message}</p>
                        <input
                            placeholder="Serial"
                            {...register('serial', {
                                required: 'Vui lòng nhập serial',
                            })}
                        />
                        <p>{errors.serial?.message}</p>
                        <p>{errors.name?.message}</p>
                        <input
                            placeholder="Giá tiền"
                            type="number"
                            {...register('price', {
                                required: 'Vui lòng nhập giá tiền sản phẩm',
                            })}
                        />
                        <p>{errors.price?.message}</p>
                        <input
                            placeholder="Thời gian bảo hành"
                            type="number"
                            {...register('warrantyTime', {
                                required: 'Vui lòng nhập thời gian bảo hành',
                            })}
                        />
                        <p>{errors.warrantyTime?.message}</p>
                        <input
                            placeholder="Chu kì bảo trì"
                            type="number"
                            {...register('maintenanceTime', {
                                required: 'Vui lòng nhập chu kì bảo trì',
                            })}
                        />
                        <p>{errors.maintenanceTime?.message}</p>
                        <input
                            placeholder="ID danh mục"
                            type="number"
                            {...register('categoryId', {
                                required: 'Vui lòng nhập ID danh mục',
                            })}
                        />
                        <p>{errors.categoryId?.message}</p>
                        <button type="submit" onClick={handleSubmit(handleSubmitDevice)}>
                            +
                        </button>
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
                    <button type="button" onClick={onSubmitAll}>
                        Tạo phiếu nhập
                    </button>
                    <button type="button" onClick={cancelSubmit}>
                        Huỷ
                    </button>
                </div>
            )}
        </form>
    );
};

export default AddDevice;
