import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import httpRequest from '~/utils/htppRequest';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';

import styles from './importCoupon.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const IMPORT_URL = '/phieunhap/list';
const DEVICE_URL = '/device/list';

function ImportCoupon() {
    const [importCoupon, setImportCoupon] = useState([]);
    const [showDetail, setShowDetail] = useState(false);
    const [showInfor, setShowInfor] = useState([]);
    const { register, handleSubmit, setValue } = useForm();
    const [showSearchSite, setShowSearchSite] = useState(false);

    const [dataMiniPageSearched, setDataMiniPageSearched] = useState([]);
    const [dataMiniTableSearched, setDataMiniTableSearched] = useState([]);
    useEffect(() => {
        httpRequest
            .get(IMPORT_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                setImportCoupon(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        const data = importCoupon.map((element) => {
            const deviceName = element.devices.map((device) => device.name);
            return {
                id: element.id,
                companyName: element.companyName,
                exporter: element.exporter,
                number: element.devices.length,
                name: deviceName.join(', '),
                dateImport: element.export_date,
            };
        });
        setRowData(data);
    }, [importCoupon]);

    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [dataMiniPage, setDataMiniPage] = useState([]);
    const [dataMiniTable, setDataMiniTable] = useState([]);
    const [isOpenMiniPage, setIsOpenMiniPage] = useState(false);
    const navigate = useNavigate();
    const columnDefs = useMemo(
        () => [
            {
                headerName: 'STT',
                valueGetter: 'node.rowIndex + 1',
                sortable: false,
                width: 70,
            },
            { field: 'id', headerName: 'ID', filter: true, width: 120 },
            { field: 'companyName', headerName: 'Đơn vị cung cấp', filter: true },
            { field: 'exporter', headerName: 'Người tiếp nhận', filter: true },
            { field: 'number', headerName: 'Số lượng sản phẩm', filter: true },
            { field: 'name', headerName: 'Tên sản phẩm' },
            { field: 'dateImport', headerName: 'Ngày nhập', filter: true, flex: 1 },
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
        httpRequest
            .get(`/phieunhap?id=${rowData2.id}`, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                const dataImport = {
                    id: data.id,
                    fullname: data.fullname,
                    phone: data.phone,
                    companyName: data.companyName,
                    export_date: data.export_date,
                    exporter: data.exporter,
                    number: rowData2.number,
                };
                setDataMiniPage(dataImport);
                const devices = data.devices.map((element) => ({
                    name: element.name,
                    serial: element.serial,
                    price: element.price,
                    warrantyTime: element.warrantyTime,
                    maintenanceTime: element.maintenanceTime,
                }));
                setDataMiniTable(devices);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleCancel = () => {
        setIsOpenMiniPage(false);
        navigate('/importcoupon');
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
            .get(`http://localhost:8080/api/phieunhap/get-by-serial-device?serial=${data.serial}`, {
                withCredentials: true,
            })
            .then((response) => {
                const data_searched = {
                    id: response.data.id,
                    fullname: response.data.fullname,
                    phone: response.data.phone,
                    companyName: response.data.companyName,
                    export_date: response.data.export_date,
                    exporter: response.data.exporter,
                };
                const data_table = response.data.devices.map((element) => {
                    return {
                        name: element.name,
                        serial: element.serial,
                        price: element.price,
                        warrantyTime: element.warrantyTime,
                        maintenanceTime: element.maintenanceTime,
                    };
                });
                setDataMiniPageSearched(data_searched);
                setDataMiniTableSearched(data_table);
            })
            .catch((err) => {
                console.log(err);
                alert('Không tìm thấy thiết bị tương ứng!');
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
                        Tìm kiếm phiếu nhập theo Serial thiết bị{' '}
                    </Button>
                    <div className={cx('table')}>
                        <div className="ag-theme-alpine" style={{ width: 1360, height: 630 }}>
                            <h1>Danh sách phiếu nhập</h1>
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
                            <div className={cx('infor-coupon-searched')}>
                                <h1>Chi tiết phiếu nhập</h1>
                                <p>ID phiếu nhập : {dataMiniPageSearched.id}</p>
                                <p>Tên đơn vị cung cấp : {dataMiniPageSearched.companyName}</p>
                                <p>Người phụ trách cung cấp : {dataMiniPageSearched.fullname}</p>
                                <p>Số điện thoại người cung cấp : {dataMiniPageSearched.phone}</p>
                                <p>Người nhận: {dataMiniPageSearched.exporter}</p>
                                <p>Ngày nhập : {dataMiniPageSearched.export_date}</p>
                            </div>
                            <div className={cx('table-2-searched')}>
                                <div className="ag-theme-alpine" style={{ width: 1010, height: 500 }}>
                                    <h1>Bảng thiết bị nhập({dataMiniPageSearched.number})</h1>
                                    <AgGridReact
                                        ref={gridRef}
                                        rowData={dataMiniTableSearched}
                                        columnDefs={columnDefsmini}
                                        defaultColDef={defaultColDef}
                                        animateRows={true}
                                        onCellContextMenu={cellContextMenuListener}
                                    />
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
                            <h1>Chi tiết phiếu nhập</h1>
                            <p>ID phiếu nhập : {dataMiniPage.id}</p>
                            <p>Tên đơn vị cung cấp : {dataMiniPage.companyName}</p>
                            <p>Người phụ trách cung cấp : {dataMiniPage.fullname}</p>
                            <p>Số điện thoại người cung cấp : {dataMiniPage.phone}</p>
                            <p>Người nhận: {dataMiniPage.exporter}</p>
                            <p>Ngày nhập : {dataMiniPage.export_date}</p>
                        </div>
                        <div className={cx('table-2', { hide: showDetail })}>
                            <div className="ag-theme-alpine" style={{ width: 1010, height: 500 }}>
                                <h2>Bảng thiết bị nhập({dataMiniPage.number})</h2>
                                <AgGridReact
                                    ref={gridRef}
                                    rowData={dataMiniTable}
                                    columnDefs={columnDefsmini}
                                    defaultColDef={defaultColDef}
                                    animateRows={true}
                                    onCellContextMenu={cellContextMenuListener}
                                />
                            </div>
                        </div>
                        <Button className={cx('button')} primary onClick={handleCancel}>
                            Huỷ
                        </Button>
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
                </div>
            )}
        </div>
    );
}

export default ImportCoupon;
