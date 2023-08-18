import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import httpRequest from '~/utils/htppRequest';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useNavigate } from 'react-router-dom';

import styles from './service.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const DEVICE_URL = '/device/list';

const Service = () => {
    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
    const [showDetail, setShowDetail] = useState(false);
    const [showInfor, setShowInfor] = useState([]);
    const navigate = useNavigate();

    const columnDefs = useMemo(
        () => [
            {
                headerName: 'STT',
                valueGetter: 'node.rowIndex + 1',
                sortable: false,
                width: 70,
            },

            { field: 'name', headerName: 'TÊN THIẾT BỊ', filter: true, width: 300 },
            { field: 'serial', headerName: 'SERIAL', filter: true },
            { field: 'price', headerName: 'Giá tiền', filter: true, width: 150 },
            { field: 'warrantyTime', headerName: 'Thời hạn bảo hành', filter: true, width: 170 },
            { field: 'maintenanceTime', headerName: 'Chu kì bảo trì', filter: true, width: 150 },
            { field: 'status', headerName: 'Trạng thái xuất', filter: true },
            { field: 'warrantyStatus', headerName: 'Trạng thái bảo hành', filter: true },
            { field: 'maintenanceStatus', headerName: 'Trạng thái bảo trì', filter: true, flex: 1 },
        ],
        [],
    );

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo(
        () => ({
            sortable: true,
        }),
        [],
    );
    const cellClickedListener = useCallback((event) => {
        console.log('cellClicked', event);
    }, []);

    const rowClickedListener = useCallback((event) => {
        console.log('rowClicked', event);
    }, []);
    useEffect(() => {
        httpRequest
            .get(DEVICE_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data; // Assuming the response is an array of objects
                setRowData(data);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const cellContextMenuListener = useCallback((params) => {
        params.event.preventDefault();
        const selectedRow = params.node.data;
        const dataResponse = selectedRow;
        const options = {
            detail: {
                name: 'Chi tiết thiết bị',
                action: () => handleDetail(dataResponse),
            },
            update: {
                name: 'Cập nhật thông tin',
                action: () => handleUpdate(dataResponse),
            },
            export: {
                name: 'Tạo phiếu xuất',
                action: () => handleExport(dataResponse),
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

    const handleUpdate = (data) => {
        navigate(`/updatedevice?id=${data.id}`);
    };

    const handleExport = (data) => {
        navigate(`/exportdevice?serial=${data.serial}`);
    };

    const handleWarrantyState = (data) => {
        navigate(`/handover?serial=${data.serial}`);
    };

    const handleMaintainanceState = (data) => {
        httpRequest
            .get(`/device/confirm-maintance?serial=${data.serial}`, { withCredentials: true })
            .then((response) => {
                alert('Thay đổi trạng thái bảo trì thành công');
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleAdd = (data) => {
        navigate('/adddevice?role=ROLE_ADMIN');
    };

    const handleExportList = () => {
        navigate('/exportlistdevice?role=ROLE_ADMIN');
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
    console.log('check', showInfor);
    localStorage.setItem('previousPage', 'service');
    return (
        <div className={cx('wrapper')}>
            <div className={cx('back-ground-img')}></div>
            <div className={cx('table', { hide: showDetail })}>
                <div
                    className={cx('overlay', { show: showDetail })}
                    onClick={() => {
                        setShowDetail(false);
                    }}
                ></div>
                <div className={cx('wrapper-1')}>
                    <div className={cx('buttons')}>
                        <Button rounded onClick={handleAdd}>
                            Nhập thiết bị
                        </Button>
                        <Button rounded onClick={handleExportList}>
                            Xuất thiết bị
                        </Button>
                        <Button
                            rounded
                            onClick={() => {
                                navigate('/search');
                            }}
                        >
                            Tìm kiếm{' '}
                        </Button>
                    </div>
                    <div className={cx('device-infor')}>
                        <h1>Bảng danh sách thiết bị </h1>
                        <div className={cx('table')}>
                            <div className={cx('ag-theme-alpine')} style={{ width: 1610, height: 650, color: 'red' }}>
                                <AgGridReact
                                    ref={gridRef}
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    defaultColDef={defaultColDef}
                                    animateRows={true}
                                    onCellClicked={cellClickedListener}
                                    onRowClicked={rowClickedListener}
                                    onCellContextMenu={cellContextMenuListener}
                                />
                            </div>
                        </div>
                    </div>
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
    );
};

export default Service;
