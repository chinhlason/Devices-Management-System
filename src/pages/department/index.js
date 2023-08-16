import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
const DEVICE_URL = '/device/list';
function Department() {
    const gridRef = useRef();
    const [userList, setUserList] = useState([]);
    const [exportList, setExportList] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [isOpenMiniPage, setIsOpenMiniPage] = useState(false);
    const [dataMiniPage, setDataMiniPage] = useState([]);
    const [rowChose, setRowChose] = useState([]);
    const [showDetail, setShowDetail] = useState(false);
    const [showInfor, setShowInfor] = useState([]);
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

    const cellContextMenuListener = useCallback((params) => {
        params.event.preventDefault();
        const selectedRow = params.node.data;
        const dataResponse = selectedRow;
        const options = {
            detail: {
                name: 'Chi tiết thiết bị',
                action: () => handleDetail(dataResponse),
            },
            warrantyState: {
                name: 'Chỉnh sửa trạng thái bảo hành',
                action: () => handleWarrantyState(dataResponse),
            },
            maintainanceState: {
                name: 'Chỉnh sửa trạng thái bảo trì',
                action: () => handleMaintainanceState(dataResponse),
            },
        };
        if (dataResponse.status === 'DA_XUAT') {
            delete options.export;
        }
        if (dataResponse.warrantyStatus !== 'DANG_BAO_HANH') {
            delete options.warrantyState;
        }
        if (dataResponse.maintenanceStatus !== 'CAN_BAO_TRI') {
            delete options.maintainanceState;
        }
        showContextMenu(params.event.clientX, params.event.clientY, options);
    }, []);
    const showContextMenu = (clientX, clientY, options) => {
        const contextMenuDiv = document.createElement('div');
        contextMenuDiv.id = 'customContextMenu';
        contextMenuDiv.style.position = 'absolute';
        contextMenuDiv.style.left = `${clientX}px`;
        contextMenuDiv.style.top = `${clientY}px`;
        contextMenuDiv.style.backgroundColor = 'white';
        contextMenuDiv.style.padding = '5px';
        contextMenuDiv.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
        contextMenuDiv.style.zIndex = '999';

        for (const key in options) {
            const menuItem = document.createElement('div');
            menuItem.innerText = options[key].name;
            menuItem.style.cursor = 'pointer';
            menuItem.style.padding = '5px 10px';

            menuItem.addEventListener('click', () => {
                options[key].action();
                document.removeEventListener('click', handleDocumentClick);
                document.body.removeChild(contextMenuDiv);
            });

            contextMenuDiv.appendChild(menuItem);
        }

        document.body.appendChild(contextMenuDiv);

        const handleDocumentClick = (event) => {
            if (!contextMenuDiv.contains(event.target)) {
                document.removeEventListener('click', handleDocumentClick);
                document.body.removeChild(contextMenuDiv);
            }
        };

        document.addEventListener('click', handleDocumentClick);
    };

    useEffect(() => {
        const handleContextMenu = (event) => {
            event.preventDefault(); // Ngăn chặn hiển thị hộp thoại mặc định của trình duyệt
        };
        document.addEventListener('contextmenu', handleContextMenu);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);
    const handleWarrantyState = (data) => {
        navigate(`/handover?serial=${data.serial}`);
    };

    const handleMaintainanceState = (data) => {
        console.log(1);
    };

    const handleDetail = (serial) => {
        httpRequest
            .get(DEVICE_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data; // Assuming the response is an array of objects
                const result = data.find((element) => {
                    return serial.serial === element.serial;
                });
                console.log('kq', result);
                setShowInfor(result);
            })
            .catch((err) => {
                console.log(err);
            });
        setShowDetail(true);
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
                    <div className={cx('table', { hide: showDetail })}>
                        <div
                            className={cx('overlay', { show: showDetail })}
                            onClick={() => {
                                setShowDetail(false);
                            }}
                        ></div>
                        <div className="ag-theme-alpine" style={{ width: 1810, height: 500 }}>
                            <h1>
                                Chi tiết thiết bị phòng {rowChose.tenPhong}, ban {rowChose.tenBan}, viện{' '}
                                {rowChose.tenVien}
                            </h1>
                            <AgGridReact
                                ref={gridRef}
                                rowData={dataMiniPage}
                                columnDefs={columnDefsmini}
                                defaultColDef={defaultColDef}
                                animateRows={true}
                                onCellContextMenu={cellContextMenuListener}
                            />
                            <Button className={cx('button-2')} primary onClick={handleCancel}>
                                Huỷ
                            </Button>
                        </div>
                    </div>

                    <div className={cx('device-infor-detail', { show: showDetail })}>
                        <Button
                            className={cx('button-cancel')}
                            primary
                            onClick={() => {
                                setShowDetail(false);
                            }}
                        >
                            X
                        </Button>
                        <h2>Thông tin thiết bị {showInfor.serial}</h2>
                        <p>Tên thiết bị : {showInfor.name}</p>
                        <p>Serial : {showInfor.serial}</p>
                        {showInfor && showInfor.category && showInfor.category.name && (
                            <p>Danh mục sản phẩm : {showInfor.category.name}</p>
                        )}
                        {showInfor && showInfor.category && showInfor.category.description && (
                            <p>Chi tiết sản phẩm : {showInfor.category.description}</p>
                        )}
                        <p>Giá tiền : {showInfor.price}</p>
                        <p>Trạng thái xuất : {showInfor.status}</p>
                        <p>Thời gian bảo hành : {showInfor.warrantyTime}</p>
                        <p>Trạng thái bảo hành : {showInfor.warrantyStatus}</p>
                        <p>Chu kỳ bảo trì : {showInfor.maintenanceTime}</p>
                        <p>Trạng thái bảo trì : {showInfor.maintenanceStatus}</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Department;
