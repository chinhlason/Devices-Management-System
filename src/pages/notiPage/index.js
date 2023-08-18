import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import httpRequest from '~/utils/htppRequest';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useNavigate } from 'react-router-dom';

import styles from './notiPage.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const REQUEST_URL = '/warrantycard/list-unconfirm';
const DEVICE_URL = '/device/list';

function NotiPage() {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [saveData, setSaveData] = useState([]);
    const [alertShown, setAlertShown] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showInfor, setShowInfor] = useState([]);
    const [showInforDevice, setShowInforDevice] = useState([]);
    const navigate = useNavigate();
    let count = 0;
    const columnDefs = useMemo(
        () => [
            {
                headerName: 'STT',
                valueGetter: 'node.rowIndex + 1',
                sortable: false,
                width: 70,
            },
            { field: 'id', headerName: 'ID', filter: true, width: 90 },
            { field: 'type', headerName: 'Loại yêu cầu', filter: true },
            { field: 'receiver', headerName: 'Người gửi', filter: true },
            { field: 'note', headerName: 'Ghi chú' },
            { field: 'serial', headerName: 'Serial', filter: true },
            { field: 'tenPhong', headerName: 'Tên phòng', filter: true },
            { field: 'tenBan', headerName: 'Tên ban', filter: true },
            { field: 'tenVien', headerName: 'Tên viện', filter: true, width: 120, flex: 1 },
            {
                headerName: '',
                field: 'actions',
                cellRenderer: ({ data }) => (
                    <div>
                        <Button
                            className={cx('button-accept')}
                            primary
                            onClick={() => {
                                handleAccess(data);
                            }}
                        >
                            Chấp nhận
                        </Button>
                    </div>
                ),
                width: 140,
                suppressMenu: true,
                sortable: false,
                filter: false,
            },
            {
                headerName: '',
                field: 'actions',
                cellRenderer: ({ data }) => (
                    <div>
                        <Button
                            className={cx('button-deny')}
                            primary
                            onClick={() => {
                                handleDeny(data);
                            }}
                        >
                            Từ chối
                        </Button>
                    </div>
                ),
                width: 150,
                suppressMenu: true,
                sortable: false,
                filter: false,
            },
        ],
        [],
    );
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
            .get(REQUEST_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                console.log(data);
                setSaveData(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [alertShown]);
    console.log('save', saveData);
    useEffect(() => {
        const newData = saveData.map((element) => {
            return httpRequest.get(`/user?username=${element.receiver}`, { withCredentials: true }).then((response) => {
                const dataSave = {
                    id: element.id,
                    type: 'BH',
                    receiver: element.receiver,
                    note: element.note,
                    serial: element.device.serial,
                    tenPhong: response.data.tenPhong,
                    tenBan: response.data.tenBan,
                    tenVien: response.data.tenVien,
                };
                console.log('sss', dataSave);
                return dataSave;
            });
        });

        Promise.all(newData).then((resolvedData) => {
            setRowData(resolvedData);
        });
    }, [saveData, count]);

    const handleAccess = (data) => {
        httpRequest
            .get(`/warrantycard/confirm?id=${data.id}`, { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                alert('Thành công');
                setAlertShown(true);
                navigate('/notification');
            })
            .catch((err) => {
                console.log(err);
                alert('Lỗi');
                setAlertShown(true);
                navigate('/notification');
            });
    };

    const handleDeny = (data) => {
        httpRequest
            .get(`/warrantycard/deny?id=${data.id}`, { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                alert('Thành công');
                setAlertShown(true);
                navigate('/notification');
            })
            .catch((err) => {
                console.log(err);
                alert('Lỗi');
                setAlertShown(true);
                navigate('/notification');
            });
    };

    useEffect(() => {
        if (alertShown) {
            setAlertShown(false);
        }
    }, [alertShown]);

    const cellContextMenuListener = useCallback((params) => {
        params.event.preventDefault();
        const selectedRow = params.node.data;
        const dataResponse = selectedRow;
        const options = {
            detail: {
                name: 'Chi tiết yêu cầu',
                action: () => handleDetail(dataResponse),
            },
        };

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

    const handleDetail = (data) => {
        console.log('checker', data.serial);
        httpRequest
            .get(DEVICE_URL, { withCredentials: true })
            .then((response) => {
                const data_input = response.data; // Assuming the response is an array of objects
                const result = data_input.find((element) => {
                    return data.serial === element.serial;
                });
                console.log('kq', result);
                setShowInforDevice(result);
            })
            .catch((err) => {
                console.log(err);
            });
        setShowInfor(data);
        setShowDetail(true);
    };
    console.log('datachecked', showInfor);
    console.log('datadevice', showInforDevice);
    return (
        <div className={cx('wrapper')}>
            <div
                className={cx('overlay', { show: showDetail })}
                onClick={() => {
                    setShowDetail(false);
                }}
            ></div>
            <div className={cx('content-main')}>
                <div className={cx('back-ground-img')}></div>
                <div className="ag-theme-alpine" style={{ width: 1815, height: 500 }}>
                    <h1>Danh sách yêu cầu bảo hành, bảo trì</h1>
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        animateRows={true}
                        onCellContextMenu={cellContextMenuListener}
                    />
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
                <div className={cx('coupon-block')}>
                    <p>ID : {showInfor.id}</p>
                    <p>Loại yêu cầu : {showInfor.type}</p>
                    <p>Người gửi : {showInfor.receiver}</p>
                    <p>Ghi chú : {showInfor.note}</p>
                    <p>
                        Tên phòng : {showInfor.tenPhong}, Tên ban : {showInfor.tenBan}, Tên viện : {showInfor.tenVien}
                    </p>
                </div>
                <div className={cx('device-block')}>
                    <p>Tên thiết bị : {showInforDevice.name}</p>
                    <p>Serial : {showInforDevice.serial}</p>
                    {showInforDevice && showInforDevice.category && showInforDevice.category.name && (
                        <p>Danh mục sản phẩm : {showInforDevice.category.name}</p>
                    )}
                    {showInforDevice && showInforDevice.category && showInforDevice.category.description && (
                        <p>Chi tiết sản phẩm : {showInforDevice.category.description}</p>
                    )}
                    <p>Giá tiền : {showInforDevice.price}</p>
                    <p>Trạng thái xuất : {showInforDevice.status}</p>
                    <p>Thời gian bảo hành : {showInforDevice.warrantyTime}</p>
                    <p>Trạng thái bảo hành : {showInforDevice.warrantyStatus}</p>
                    <p>Chu kỳ bảo trì : {showInforDevice.maintenanceTime}</p>
                    <p>Trạng thái bảo trì : {showInforDevice.maintenanceStatus}</p>
                </div>
            </div>
        </div>
    );
}

export default NotiPage;
