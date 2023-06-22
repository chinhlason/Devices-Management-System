import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import httpRequest from '~/utils/htppRequest';
import { useForm, Controller, formState } from 'react-hook-form';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from 'react-router-dom';

const EXPORT_URL = '/phieuxuat/add';
const DEVICE_URL = '/device/list';
const USER_URL = '/user/list';

function ExportListDevice() {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [rowDataMini, setRowDataMini] = useState([]);
    const [showMiniPage, setShowMiniPage] = useState(false);
    const [userInfor, setUserInfor] = useState({});
    const [isExist, setIsExist] = useState(false);
    const [isAllow, setIsAllow] = useState(true);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const columnDefs = useMemo(
        () => [
            {
                headerName: '',
                field: 'checkbox',
                headerCheckboxSelection: true,
                checkboxSelection: true,

                width: 50,
            },
            { field: 'name', headerName: 'TÊN THIẾT BỊ', filter: true },
            { field: 'serial', headerName: 'SERIAL', filter: true },
            { field: 'price', headerName: 'Giá tiền' },
            { field: 'warrantyTime', headerName: 'Thời hạn bảo hành', filter: true },
            { field: 'maintenanceTime', headerName: 'Chu kì bảo trì', filter: true },
            { field: 'status', headerName: 'Trạng thái xuất', filter: true },
            { field: 'warrantyStatus', headerName: 'Trạng thái bảo hành', filter: true },
            { field: 'maintenanceStatus', headerName: 'Trạng thái bảo trì', filter: true },
        ],
        [],
    );

    useEffect(() => {
        httpRequest
            .get(DEVICE_URL, { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                const responseList = response.data.filter(function (device) {
                    return device.status !== 'DA_XUAT';
                });
                setRowDataMini(responseList);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
        }),
        [],
    );

    const rowClickedListener = useCallback((event) => {
        console.log('rowClicked', event);
    }, []);

    const handleAdd = () => {
        setShowMiniPage(true);
    };
    console.log(userInfor.username);
    const handleAddCoupon = () => {
        if (userInfor !== undefined && rowData.length !== 0) {
            setIsAllow(true);
            const resquestData = {
                receiver: userInfor.username,
                devices: rowData.map((device) => device.serial),
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
        } else {
            setIsAllow(false);
        }
    };
    const handleAddList = () => {
        const selectedRows = gridRef.current.api.getSelectedRows();
        console.log('Selected Rows:', selectedRows);
        const newData = [...rowData, ...selectedRows];
        setRowData(newData);
        setShowMiniPage(false);
        const newDataMiniPage = rowDataMini.filter((element) => !selectedRows.includes(element));
        console.log(newDataMiniPage);
        setRowDataMini(newDataMiniPage);
    };
    console.log(rowData);
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
    return (
        <div>
            <h2>TẠO PHIẾU XUẤT</h2>
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
            </form>
            {isExist ? (
                <div>
                    <p>Username: {userInfor.username}</p>
                    <p>Tên người nhận: {userInfor.fullname}</p>
                    <p>
                        Phòng, Ban, Viện: {userInfor.tenPhong}, {userInfor.tenVien}, {userInfor.tenBan}
                    </p>
                </div>
            ) : (
                <p> Không tồn tại người dùng </p>
            )}
            {showMiniPage ? (
                <div>
                    <h2>Chọn thiết bị xuất kho</h2>
                    <button onClick={handleAddList}>Thêm thiết bị</button>
                    <button onClick={() => setShowMiniPage(false)}>Đóng</button>
                    <div className="ag-theme-alpine" style={{ width: 1500, height: 500 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowDataMini}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            animateRows={true}
                            enableRangeSelection={true}
                            allowContextMenuWithControlKey={true}
                            onRowClicked={rowClickedListener}
                            getRowNodeId={(data) => data.serial}
                            rowSelection="multiple"
                        />
                    </div>
                </div>
            ) : (
                <div className="ag-theme-alpine" style={{ width: 1500, height: 500 }}>
                    <button onClick={handleAdd}>Thêm thiết bị</button>
                    <AgGridReact
                        columnDefs={columnDefs}
                        ref={gridRef}
                        rowData={rowData}
                        defaultColDef={defaultColDef}
                        animateRows={true}
                        onRowClicked={rowClickedListener}
                        rowSelection="multiple"
                    />
                    <button onClick={handleAddCoupon}>Tạo phiếu xuất</button>
                    {!isAllow && <p>Vui lòng nhập đủ thông tin </p>}
                </div>
            )}
        </div>
    );
}

export default ExportListDevice;
