import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import httpRequest from '~/utils/htppRequest';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from 'react-router-dom';

import styles from './department.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const USER_URL = '/user/list';
const EXPORT_URL = '/phieuxuat/list';
function Department() {
    const gridRef = useRef();
    const [userList, setUserList] = useState([]);
    const [exportList, setExportList] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [isOpenMiniPage, setIsOpenMiniPage] = useState(false);
    const [dataMiniPage, setDataMiniPage] = useState([]);
    const [rowChose, setRowChose] = useState([]);
    const navigate = useNavigate();
    const columnDefs = useMemo(
        () => [
            { field: 'tenPhong', headerName: 'Tên phòng', filter: true },
            { field: 'tenBan', headerName: 'Tên Ban', filter: true },
            { field: 'tenVien', headerName: 'Tên Viện' },
            { field: 'name', headerName: 'Tên người quản lý', filter: true },
            { field: 'username', headerName: 'Tên tài khoản quản lý', filter: true },
            { field: 'numberDevices', headerName: 'Số lượng thiết bị', filter: true },
            {
                headerName: '',
                field: 'actions',
                cellRenderer: ({ data }) => (
                    <div>
                        <Button
                            className={cx('button')}
                            primary
                            onClick={() => {
                                handleMenuClick(data);
                                setRowChose(data);
                            }}
                        >
                            Xem chi tiết
                        </Button>
                    </div>
                ),
                width: 150,
                height: 40,
                suppressMenu: true,
                sortable: false,
                filter: false,
            },
        ],
        [],
    );

    const columnDefsmini = useMemo(
        () => [
            { field: 'name', headerName: 'TÊN THIẾT BỊ', filter: true },
            { field: 'serial', headerName: 'SERIAL', filter: true },
            { field: 'price', headerName: 'Giá tiền' },
            { field: 'warrantyTime', headerName: 'Thời hạn bảo hành', filter: true },
            { field: 'maintenanceTime', headerName: 'Chu kì bảo trì', filter: true },
            { field: 'status', headerName: 'Trạng thái xuất', filter: true },
            { field: 'warrantyStatus', headerName: 'Trạng thái bảo hành', filter: true },
            { field: 'maintenanceStatus', headerName: 'Trạng thái bảo trì', filter: true },
            { field: 'exporter', headerName: 'Người xuất', filter: true },
        ],
        [],
    );

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
        }),
        [],
    );
    const handleMenuClick = (rowData2) => {
        setIsOpenMiniPage(true);
    };

    useEffect(() => {
        Promise.all([
            httpRequest.get(USER_URL, { withCredentials: true }),
            httpRequest.get(EXPORT_URL, { withCredentials: true }),
        ])
            .then(([userResponse, exportResponse]) => {
                const userData = userResponse.data;
                const exportData = exportResponse.data;
                setUserList(userData);
                setExportList(exportData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        const updatedRowData = exportList.filter((element) => rowChose.username === element.receiver);
        if (updatedRowData) {
            console.log(updatedRowData);
            const concatenatedArray = [];
            updatedRowData.forEach((element) => {
                const devicesWithExporter = element.devices.map((device) => ({
                    ...device,
                    exporter: element.exporter,
                }));
                concatenatedArray.push(...devicesWithExporter);
            });
            console.log(concatenatedArray);
            setDataMiniPage(concatenatedArray);
        }
    }, [rowChose, exportList]);

    useEffect(() => {
        const updatedRowData = userList.map((user) => {
            const receiver = exportList.filter((element) => user.username === element.receiver);
            let deviceNum = 0;
            receiver.forEach((element) => {
                deviceNum += element.devices.length;
            });
            return {
                name: user.fullname,
                username: user.username,
                tenPhong: user.tenPhong,
                tenBan: user.tenBan,
                tenVien: user.tenVien,
                numberDevices: deviceNum,
            };
        });
        setRowData(updatedRowData);
    }, [userList, exportList]);

    const handleCancel = () => {
        setIsOpenMiniPage(false);
        navigate('/department');
    };

    return (
        <>
            <div className={cx('back-ground-img')}></div>

            {!isOpenMiniPage ? (
                <div className={cx('wrapper')}>
                    <div className={cx('table')}>
                        <div className="ag-theme-alpine" style={{ width: 1360, height: 650 }}>
                            <h1>Danh sách phòng ban</h1>
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
            ) : (
                <div className={cx('wrapper-2')}>
                    <div className="ag-theme-alpine" style={{ width: 1810, height: 500 }}>
                        <h1>
                            Chi tiết thiết bị phòng {rowChose.tenPhong}, ban {rowChose.tenBan}, viện {rowChose.tenVien}
                        </h1>
                        <AgGridReact
                            ref={gridRef}
                            rowData={dataMiniPage}
                            columnDefs={columnDefsmini}
                            defaultColDef={defaultColDef}
                            animateRows={true}
                        />
                        <Button className={cx('button-2')} primary onClick={handleCancel}>
                            Huỷ
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Department;
