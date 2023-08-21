import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import httpRequest from '~/utils/htppRequest';
import { useForm } from 'react-hook-form';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useNavigate } from 'react-router-dom';

import styles from './deviceByUser.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const DEVICE_URL = '/device/list-by-current-user';
const REQUEST_URL = '/warrantycard/require';
function DeviceByUsers() {
    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
    const [showDetail, setShowDetail] = useState(false);
    const [showWarranty, setShowWarranty] = useState(false);
    const [showInfor, setShowInfor] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();
    const tenVien = localStorage.getItem('tenVien');
    const tenPhong = localStorage.getItem('tenPhong');
    const tenBan = localStorage.getItem('tenBan');
    const [isOpenRequestPage, setIsOpenRequestPage] = useState(false);
    const [dataRequest, setDataRequest] = useState([]);
    const columnDefs = useMemo(
        () => [
            {
                headerName: 'STT',
                valueGetter: 'node.rowIndex + 1',
                sortable: false,
                width: 70,
            },
            { field: 'name', headerName: 'TÊN THIẾT BỊ', filter: true },
            { field: 'serial', headerName: 'SERIAL', filter: true, width: 150 },
            { field: 'price', headerName: 'Giá tiền' },
            { field: 'warrantyTime', headerName: 'Thời hạn bảo hành', filter: true },
            { field: 'maintenanceTime', headerName: 'Chu kì bảo trì', filter: true },
            { field: 'status', headerName: 'Trạng thái xuất', filter: true },
            { field: 'warrantyStatus', headerName: 'Trạng thái bảo hành', filter: true },
            { field: 'maintenanceStatus', headerName: 'Trạng thái bảo trì', filter: true, flex: 1 },
        ],
        [],
    );
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
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
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    useEffect(() => {
        const handleContextMenu = (event) => {
            event.preventDefault(); // Ngăn chặn hiển thị hộp thoại mặc định của trình duyệt
        };
        document.addEventListener('contextmenu', handleContextMenu);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
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

            request: {
                name: 'Yêu cầu bảo hành',
                action: () => handleRequest(dataResponse),
            },
        };
        if (dataResponse.status === 'DA_XUAT') {
            delete options.export;
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
    const handleRequest = (data) => {
        console.log(data);
        setIsOpenRequestPage(true);
        setShowWarranty(true);
        setDataRequest(data);
    };

    const onSubmit = (data) => {
        const dataSend = {
            note: data.note,
            serial: dataRequest.serial,
        };
        httpRequest
            .post(REQUEST_URL, dataSend, { withCredentials: true })
            .then((response) => {
                alert('Gửi thành công');
                setIsOpenRequestPage(false);
                reset();
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleDetail = (serial) => {
        httpRequest
            .get(DEVICE_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data; // Assuming the response is an array of objects
                const result = data.find((element) => {
                    return serial.serial === element.serial;
                });
                setShowInfor(result);
            })
            .catch((err) => {
                console.log(err);
            });
        setShowDetail(true);
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Cập nhật thời gian mỗi giây

        return () => clearInterval(interval); // Xóa interval khi component unmount
    }, []);
    localStorage.setItem('previousPage', 'devicebyuser');
    return (
        <div className={cx('wrapper')}>
            <div>
                <div
                    className={cx('overlay', { show: showDetail })}
                    onClick={() => {
                        setShowDetail(false);
                    }}
                ></div>

                <div
                    className={cx('overlay-2', { show: showWarranty })}
                    onClick={() => {
                        setShowWarranty(false);
                    }}
                ></div>
                <Button
                    className={cx('search-btn')}
                    rounded
                    onClick={() => {
                        navigate('/search');
                    }}
                >
                    Tìm kiếm{' '}
                </Button>
                <div className={cx('content-main')}>
                    <div className={cx('back-ground-img')}></div>
                    <div className={cx('table-2')}>
                        <div className="ag-theme-alpine" style={{ width: 1610, height: 620 }}>
                            <h1>
                                Danh sách thiết bị thuộc phòng {tenPhong}, ban {tenBan}, viện {tenVien}
                            </h1>
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

            <div className={cx('device-infor-to-warranty', { show: showWarranty })}>
                <h1>Yêu cầu bảo hành thiết bị {dataRequest.name}</h1>
                <h1>Serial {dataRequest.serial}</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        className={cx('form-box', 'form-box-large')}
                        placeholder="Nhập yêu cầu bảo hành"
                        {...register('note', {
                            required: 'Vui lòng nhập yêu cầu bảo hành',
                        })}
                    />
                    <p>{errors.note?.message}</p>
                    <p>{currentTime.toLocaleString()}</p>
                    <Button primary type="submit" className={cx('button-submit')}>
                        Gửi
                    </Button>
                </form>
                <Button
                    primary
                    className={cx('button-cancel-submit')}
                    onClick={() => {
                        setShowWarranty(false);
                    }}
                >
                    Huỷ
                </Button>
            </div>
        </div>
    );
}

export default DeviceByUsers;
