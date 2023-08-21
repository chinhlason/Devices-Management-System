import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import httpRequest from '~/utils/htppRequest';
import { useForm } from 'react-hook-form';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './exportListByUser.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const EXPORT_URL = '/phieuxuat/list-by-current-user';

function ExportListByUser() {
    const [exportCoupon, setExportCoupon] = useState([]);
    const { register, handleSubmit, setValue } = useForm();
    useEffect(() => {
        httpRequest
            .get(EXPORT_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                setExportCoupon(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        const data = exportCoupon.map((element) => {
            const deviceName = element.devices.map((device) => device.name);
            return {
                id: element.id,
                exporter: element.exporter,
                receiver: element.receiver,
                number: element.devices.length,
                name: deviceName.join(', '),
                dateExport: element.exportDate,
            };
        });
        setRowData(data);
    }, [exportCoupon]);
    const gridRef = useRef();
    const gridRef2 = useRef();
    const [rowData, setRowData] = useState([]);
    const [dataMiniPage, setDataMiniPage] = useState([]);
    const [dataMiniTable, setDataMiniTable] = useState([]);
    const [dataMiniPageSearched, setDataMiniPageSearched] = useState([]);
    const [dataMiniTableSearched, setDataMiniTableSearched] = useState([]);
    const [isOpenMiniPage, setIsOpenMiniPage] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showSearchSite, setShowSearchSite] = useState(false);
    const [showInfor, setShowInfor] = useState([]);
    const columnDefs = useMemo(
        () => [
            {
                headerName: 'STT',
                valueGetter: 'node.rowIndex + 1',
                sortable: false,
                width: 70,
            },
            { field: 'id', headerName: 'ID', filter: true, width: 120 },
            { field: 'exporter', headerName: 'Người xuất', filter: true },
            { field: 'receiver', headerName: 'Người tiếp nhận', filter: true },
            { field: 'number', headerName: 'Số lượng sản phẩm', filter: true },
            { field: 'name', headerName: 'Tên sản phẩm' },
            { field: 'dateExport', headerName: 'Ngày xuất', filter: true, flex: 1 },
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
            { field: 'name', headerName: 'TÊN THIẾT BỊ', filter: true, width: 250 },
            { field: 'serial', headerName: 'SERIAL', filter: true, width: 150 },
            { field: 'price', headerName: 'Giá tiền', width: 150 },
            { field: 'warrantyTime', headerName: 'Thời hạn bảo hành', filter: true },
            { field: 'maintenanceTime', headerName: 'Chu kì bảo trì', filter: true, flex: 1 },
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
            .get(EXPORT_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                const data_coupon = data.find((element) => {
                    return element.id === rowData2.id;
                });
                const data_input = {
                    id: data_coupon.id,
                    exporter: data_coupon.exporter,
                    receiver: data_coupon.receiver,
                    exportDate: data_coupon.exportDate,
                    number: data_coupon.devices.length,
                };
                const data_table = data_coupon.devices.map((element) => {
                    return {
                        name: element.name,
                        serial: element.serial,
                        price: element.price,
                        warrantyTime: element.warrantyTime,
                        maintenanceTime: element.maintenanceTime,
                    };
                });
                setDataMiniPage(data_input);
                setDataMiniTable(data_table);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onSubmit = (data) => {
        httpRequest
            .get(EXPORT_URL, { withCredentials: true })
            .then((response) => {
                const data_input = response.data;
                const result = data_input.find((element) => {
                    return element.devices.some((value) => {
                        return value.serial === data.serial;
                    });
                });
                if (result !== undefined) {
                    const data_searched = {
                        id: result.id,
                        exporter: result.exporter,
                        receiver: result.receiver,
                        exportDate: result.exportDate,
                        number: result.devices.length,
                    };
                    const data_table = result.devices.map((element) => {
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
                } else {
                    alert('Không tìm thấy thiết bị tương ứng!');
                }
            })
            .catch((err) => {
                console.log(err);
            });
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
            .get(EXPORT_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                const result = data.flatMap((element) => {
                    return element.devices.filter((value) => {
                        return value.serial === serial.serial;
                    });
                });
                setShowInfor(result[0]);
            })
            .catch((err) => {
                console.log(err);
            });
        setShowDetail(true);
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
                <div>
                    <div className={cx('wrapper')}>
                        <Button
                            className={cx('search-btn')}
                            rounded
                            onClick={() => {
                                setShowSearchSite(true);
                            }}
                        >
                            {' '}
                            Tìm kiếm phiếu xuất theo Serial thiết bị{' '}
                        </Button>
                        <div className={cx('table')}>
                            <div className="ag-theme-alpine" style={{ width: 1360, height: 600 }}>
                                <h1>Danh sách phiếu xuất</h1>
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
                                <h1>Chi tiết phiếu xuất</h1>
                                <p>ID phiếu xuất : {dataMiniPageSearched.id}</p>
                                <p>Người xuất : {dataMiniPageSearched.exporter}</p>
                                <p>Người nhận : {dataMiniPageSearched.receiver}</p>
                                <p>Ngày xuất : {dataMiniPageSearched.exportDate}</p>
                            </div>
                            <div className={cx('table-2-searched')}>
                                <div className="ag-theme-alpine" style={{ width: 1010, height: 500 }}>
                                    <h1>Bảng thiết bị nhập({dataMiniPageSearched.number})</h1>
                                    <AgGridReact
                                        ref={gridRef2}
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
                            <h1>Chi tiết phiếu xuất</h1>
                            <p>ID phiếu xuất : {dataMiniPage.id}</p>
                            <p>Người xuất : {dataMiniPage.exporter}</p>
                            <p>Người nhận : {dataMiniPage.receiver}</p>
                            <p>Ngày xuất : {dataMiniPage.exportDate}</p>
                        </div>
                        <div className={cx('table-2')}>
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
                            <Button
                                className={cx('button')}
                                primary
                                onClick={() => {
                                    setIsOpenMiniPage(false);
                                }}
                            >
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
                </div>
            )}
        </div>
    );
}

export default ExportListByUser;
