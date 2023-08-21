import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import httpRequest from '~/utils/htppRequest';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useNavigate } from 'react-router-dom';

import styles from './warrantyCoupon.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const WARRANTY_URL = '/warrantycard/list';
const DEVICE_URL = '/device/list';

function WarrantyCoupon() {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [dataMiniPage, setDataMiniPage] = useState([]);
    const [dataMiniTable, setDataMiniTable] = useState([]);
    const [isOpenMiniPage, setIsOpenMiniPage] = useState(false);
    const [isOpenMiniPage2, setIsOpenMiniPage2] = useState(false);
    const [dataMiniPageSearched, setDataMiniPageSearched] = useState([]);
    const [showSearchSite, setShowSearchSite] = useState(false);
    const [dataMiniTableSearched, setDataMiniTableSearched] = useState([]);
    const { register, handleSubmit, setValue } = useForm();
    const navigate = useNavigate();
    const [warrantyCoupon, setWarrantyCoupon] = useState([]);
    const [showDetail, setShowDetail] = useState(false);
    const [showInfor, setShowInfor] = useState([]);
    const defaultColDef = useMemo(
        () => ({
            sortable: true,
        }),
        [],
    );

    useEffect(() => {
        httpRequest
            .get(WARRANTY_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                setWarrantyCoupon(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        const data = warrantyCoupon.map((element) => {
            return {
                id: element.id,
                date: element.createAt,
                handoverDate: element.handoverDate,
                receiver: element.receiver,
                confirmer: element.confirmer,
                note: element.note,
                name: element.device.name,
                serial: element.device.serial,
                status: element.status,
                confirmStatus: element.confirmStatus,
            };
        });
        setRowData(data);
    }, [warrantyCoupon]);

    const columnDefsmini = useMemo(
        () => [
            {
                headerName: 'STT',
                valueGetter: 'node.rowIndex + 1',
                sortable: false,
                width: 70,
            },
            { field: 'name', headerName: 'TÊN THIẾT BỊ', filter: true },
            { field: 'serial', headerName: 'SERIAL', filter: true },
            { field: 'price', headerName: 'Giá tiền' },
            { field: 'warrantyTime', headerName: 'Thời hạn bảo hành', filter: true },
            { field: 'maintenanceTime', headerName: 'Chu kì bảo trì', filter: true },
            { field: 'warrantyStatus', headerName: 'Trạng thái bảo hành', filter: true },
            { field: 'maintenanceStatus', headerName: 'Trạng thái bảo trì', filter: true, width: 160 },
        ],
        [],
    );

    const columnDefs = useMemo(
        () => [
            {
                headerName: 'STT',
                valueGetter: 'node.rowIndex + 1',
                sortable: false,
                width: 70,
            },
            { field: 'id', headerName: 'ID', filter: true, width: 120 },
            { field: 'date', headerName: 'Ngày tạo phiếu', filter: true, width: 160 },
            { field: 'handoverDate', headerName: 'Ngày bàn giao', filter: true, width: 160 },
            { field: 'receiver', headerName: 'Người yêu cầu', filter: true, width: 150 },
            { field: 'confirmer', headerName: 'Người xác nhận', filter: true, width: 160 },
            { field: 'note', headerName: 'Ghi chú', filter: true, width: 160 },
            { field: 'name', headerName: 'Tên sản phẩm', filter: true },
            { field: 'serial', headerName: 'Serial', filter: true, width: 120 },
            { field: 'status', headerName: 'Trạng thái bảo hành', filter: true },
            { field: 'confirmStatus', headerName: 'Trạng thái xác nhận', filter: true },
            {
                headerName: '',
                field: 'actions',
                cellRenderer: ({ data }) => (
                    <div>
                        <Button
                            primary
                            onClick={() => {
                                handleMenuClick(data);
                            }}
                        >
                            Xem chi tiết
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

    const columnDefs2 = useMemo(
        () => [
            {
                headerName: 'STT',
                valueGetter: 'node.rowIndex + 1',
                sortable: false,
                width: 70,
            },
            { field: 'id', headerName: 'ID', filter: true, width: 120 },
            { field: 'date', headerName: 'Ngày tạo phiếu', filter: true, width: 160 },
            { field: 'handoverDate', headerName: 'Ngày bàn giao', filter: true, width: 160 },
            { field: 'receiver', headerName: 'Người yêu cầu', filter: true, width: 150 },
            { field: 'confirmer', headerName: 'Người xác nhận', filter: true, width: 160 },
            { field: 'note', headerName: 'Ghi chú', filter: true, width: 160 },
            { field: 'name', headerName: 'Tên sản phẩm', filter: true },
            { field: 'serial', headerName: 'Serial', filter: true, width: 120 },
            { field: 'status', headerName: 'Trạng thái bảo hành', filter: true },
            { field: 'confirmStatus', headerName: 'Trạng thái xác nhận', filter: true },
            {
                headerName: '',
                field: 'actions',
                cellRenderer: ({ data }) => (
                    <div>
                        <Button
                            primary
                            onClick={() => {
                                handleMenuClick2(data);
                            }}
                        >
                            Xem chi tiết
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

    const handleMenuClick = (rowData2) => {
        setIsOpenMiniPage(true);
        httpRequest
            .get(`/warrantycard?id=${rowData2.id}`, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                const dataImport = {
                    id: data.id,
                    createAt: data.createAt,
                    handoverDate: data.handoverDate,
                    receiver: data.receiver,
                    confirmer: data.confirmer,
                    note: data.note,
                    status: data.status,
                    confirmStatus: data.confirmStatus,
                    price: data.price,
                };
                setDataMiniPage(dataImport);
                const devices = {
                    name: data.device.name,
                    serial: data.device.serial,
                    price: data.device.price,
                    warrantyTime: data.device.warrantyTime,
                    maintenanceTime: data.device.maintenanceTime,
                    warrantyStatus: data.device.warrantyStatus,
                    maintenanceStatus: data.device.maintenanceStatus,
                };
                setDataMiniTable([devices]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleMenuClick2 = (rowData2) => {
        setIsOpenMiniPage2(true);
        httpRequest
            .get(`/warrantycard?id=${rowData2.id}`, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                const dataImport = {
                    id: data.id,
                    createAt: data.createAt,
                    handoverDate: data.handoverDate,
                    receiver: data.receiver,
                    confirmer: data.confirmer,
                    note: data.note,
                    status: data.status,
                    confirmStatus: data.confirmStatus,
                    price: data.price,
                };
                setDataMiniPage(dataImport);
                const devices = {
                    name: data.device.name,
                    serial: data.device.serial,
                    price: data.device.price,
                    warrantyTime: data.device.warrantyTime,
                    maintenanceTime: data.device.maintenanceTime,
                    warrantyStatus: data.device.warrantyStatus,
                    maintenanceStatus: data.device.maintenanceStatus,
                };
                setDataMiniTable([devices]);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleCancel = () => {
        setIsOpenMiniPage(false);
        navigate('/warrantycoupon');
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
    const onSubmit = (data) => {
        httpRequest
            .get(`/warrantycard/list-by-serial-device?serial=${data.serial}`, {
                withCredentials: true,
            })
            .then((response) => {
                const data_searched = response.data.map((element) => {
                    return {
                        id: element.id,
                        date: element.createAt,
                        handoverDate: element.handoverDate,
                        receiver: element.receiver,
                        confirmer: element.confirmer,
                        note: element.note,
                        name: element.device.name,
                        serial: element.device.serial,
                        status: element.status,
                        confirmStatus: element.confirmStatus,
                    };
                });
                setDataMiniPageSearched(data_searched);
            })
            .catch((err) => {
                alert('Không tìm thấy phiếu bảo hành cho thiết bị tương ứng!');
                console.log(err);
            });
    };

    return (
        <div className={cx('content-all')}>
            <div
                className={cx('overlay-2', { show: showSearchSite })}
                onClick={() => {
                    setShowSearchSite(false);
                }}
            ></div>
            <div className={cx('back-ground-img')}></div>

            {!isOpenMiniPage ? (
                <div className={cx('wrapper')}>
                    <Button
                        className={cx('search-btn')}
                        rounded
                        onClick={() => {
                            setShowSearchSite(true);
                        }}
                    >
                        {' '}
                        Tìm kiếm phiếu bảo hành theo Serial thiết bị{' '}
                    </Button>
                    <div className={cx('table')}>
                        <div className="ag-theme-alpine" style={{ width: 1790, height: 650 }}>
                            <h1>Danh sách phiếu bảo hành</h1>
                            <AgGridReact
                                ref={gridRef}
                                rowData={rowData}
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                animateRows={true}
                            />
                        </div>
                    </div>

                    <div className={cx('search-box', { show: showSearchSite })}>
                        <div className={cx('search-input-box')}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <input
                                    placeholder="Nhập serial thiết bị"
                                    {...register('serial', {
                                        minLength: {
                                            value: 3,
                                            message: 'Tối thiểu 3 kí tự',
                                        },
                                    })}
                                ></input>

                                <button className={cx('search-btn-small')} type="submit">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </button>
                            </form>

                            <Button
                                primary
                                className={cx('button-cancel-search')}
                                onClick={() => {
                                    setShowSearchSite(false);
                                    setDataMiniPageSearched([]);
                                    setDataMiniTableSearched([]);
                                    setValue('serial', '');
                                }}
                            >
                                X
                            </Button>

                            <div className={cx('table-2-searched', { hide: isOpenMiniPage2 })}>
                                <div className="ag-theme-alpine" style={{ width: 1790, height: 600 }}>
                                    <h1>Bảng phiếu bảo hành</h1>
                                    <AgGridReact
                                        ref={gridRef}
                                        rowData={dataMiniPageSearched}
                                        columnDefs={columnDefs2}
                                        defaultColDef={defaultColDef}
                                        animateRows={true}
                                    />
                                </div>
                            </div>

                            <div className={cx('search-results')}>
                                <div className={cx('wrapper-3', { show: isOpenMiniPage2 })}>
                                    <div className={cx('infor-coupon-3')}>
                                        <h1>Chi tiết phiếu bảo hành</h1>
                                        <p>ID phiếu bảo hành : {dataMiniPage.id}</p>
                                        <p>Ngày tạo phiếu : {dataMiniPage.createAt}</p>
                                        <p>Ngày bàn giao : {dataMiniPage.handoverDate}</p>
                                        <p>Người yêu cầu : {dataMiniPage.receiver}</p>
                                        <p>Người xác nhận: {dataMiniPage.confirmer}</p>
                                        <p>Ghi chú : {dataMiniPage.note}</p>
                                        <p>Trạng thái bảo hành : {dataMiniPage.status}</p>
                                        <p>Trạng thái xác nhận : {dataMiniPage.confirmStatus}</p>
                                        <p>Chi phí : {dataMiniPage.price}</p>
                                    </div>
                                    <div className={cx('table-3')}>
                                        <div className="ag-theme-alpine" style={{ width: 1370, height: 600 }}>
                                            <h2>Bảng thiết bị bảo hành</h2>
                                            <AgGridReact
                                                ref={gridRef}
                                                rowData={dataMiniTable}
                                                columnDefs={columnDefsmini}
                                                defaultColDef={defaultColDef}
                                                animateRows={true}
                                                onCellContextMenu={cellContextMenuListener}
                                            />
                                        </div>
                                        <Button
                                            className={cx('button-back')}
                                            primary
                                            onClick={() => {
                                                setIsOpenMiniPage2(false);
                                            }}
                                        >
                                            Quay lại
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={cx('wrapper-all')}>
                    <div
                        className={cx('overlay', { show: showDetail })}
                        onClick={() => {
                            setShowDetail(false);
                        }}
                    ></div>
                    <div className={cx('wrapper-2')}>
                        <div className={cx('infor-coupon')}>
                            <h1>Chi tiết phiếu bảo hành</h1>
                            <p>ID phiếu bảo hành : {dataMiniPage.id}</p>
                            <p>Ngày tạo phiếu : {dataMiniPage.createAt}</p>
                            <p>Ngày bàn giao : {dataMiniPage.handoverDate}</p>
                            <p>Người yêu cầu : {dataMiniPage.receiver}</p>
                            <p>Người xác nhận: {dataMiniPage.confirmer}</p>
                            <p>Ghi chú : {dataMiniPage.note}</p>
                            <p>Trạng thái bảo hành : {dataMiniPage.status}</p>
                            <p>Trạng thái xác nhận : {dataMiniPage.confirmStatus}</p>
                            <p>Chi phí : {dataMiniPage.price}</p>
                        </div>
                        <div className={cx('table-2')}>
                            <div className="ag-theme-alpine" style={{ width: 1370, height: 600 }}>
                                <h2>Bảng thiết bị bảo hành</h2>
                                <AgGridReact
                                    ref={gridRef}
                                    rowData={dataMiniTable}
                                    columnDefs={columnDefsmini}
                                    defaultColDef={defaultColDef}
                                    animateRows={true}
                                    onCellContextMenu={cellContextMenuListener}
                                />
                            </div>
                            <Button className={cx('button')} primary onClick={handleCancel}>
                                Quay lại
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
        </div>
    );
}

export default WarrantyCoupon;
