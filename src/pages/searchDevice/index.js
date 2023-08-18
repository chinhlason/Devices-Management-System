import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import httpRequest from '~/utils/htppRequest';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './searchDevice.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { createBrowserHistory } from 'history';
import clsx from 'clsx';
const cx = classNames.bind(styles);

const DEVICE_URL = '/device/list';
let INPUT_URL;
function SearchDevice() {
    const history = createBrowserHistory();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
    const [showDetail, setShowDetail] = useState(false);
    const [showInfor, setShowInfor] = useState([]);
    const navigate = useNavigate();
    const previousPage = localStorage.getItem('previousPage');
    const onSubmit = (data) => {
        if (previousPage === 'service') {
            INPUT_URL = '/device/list';
        } else if (previousPage === 'mainpage') {
            INPUT_URL = '/device?data=TRONG_KHO&type=status';
        } else if (previousPage === 'devicebyuser') {
            INPUT_URL = `/device/list-by-current-user`;
        } else {
            INPUT_URL = `/device/list-by-category-name?categoryName=${previousPage}`;
        }
        httpRequest
            .get(INPUT_URL, { withCredentials: true })
            .then((response) => {
                const data_input = response.data;
                const input = data.input;
                const option = data.input_option;
                if (option === 'name') {
                    const filteredDevices = data_input.filter((device) => device.name.includes(input));
                    console.log('checked1', filteredDevices);
                    if (filteredDevices.length > 0) {
                        setRowData(filteredDevices);
                    } else {
                        alert('Không tìm được sản phẩm tương ứng!');
                    }
                } else {
                    const filteredDevices = data_input.filter((device) => device.serial.includes(input));
                    console.log('checked2', filteredDevices);
                    if (filteredDevices.length > 0) {
                        setRowData(filteredDevices);
                    } else {
                        alert('Không tìm được sản phẩm tương ứng!');
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const columnDefs = useMemo(
        () => [
            {
                headerName: 'STT',
                valueGetter: 'node.rowIndex + 1',
                sortable: false,
                width: 70,
            },
            { field: 'name', headerName: 'TÊN THIẾT BỊ', filter: true },
            { field: 'serial', headerName: 'SERIAL', filter: true },
            { field: 'price', headerName: 'Giá tiền', filter: true, width: 130 },
            { field: 'warrantyTime', headerName: 'Thời hạn bảo hành', filter: true },
            { field: 'maintenanceTime', headerName: 'Chu kì bảo trì', filter: true },
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
        if (previousPage === 'mainpage') {
            delete options.export;
            delete options.update;
            delete options.warrantyState;
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
        console.log(1);
    };

    const handleAdd = (data) => {
        navigate('/adddevice?role=ROLE_ADMIN');
    };

    const handleExportList = () => {
        navigate('/exportlistdevice?role=ROLE_ADMIN');
    };

    const handleDetail = (serial) => {
        if (previousPage === 'service') {
            INPUT_URL = '/device/list';
        } else if (previousPage === 'mainpage') {
            INPUT_URL = '/device?data=TRONG_KHO&type=status';
        } else if (previousPage === 'devicebyuser') {
            INPUT_URL = `/device/list-by-current-user`;
        } else {
            INPUT_URL = `/device/list-by-category-name?categoryName=${previousPage}`;
        }
        httpRequest
            .get(INPUT_URL, { withCredentials: true })
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
    console.log('trang trc', previousPage);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('back-ground-img')}></div>
            <div
                className={cx('overlay', { show: showDetail })}
                onClick={() => {
                    setShowDetail(false);
                }}
            ></div>

            <div className={cx('table', { hide: showDetail })}>
                <Button
                    primary
                    className={cx('cancel-btn')}
                    onClick={() => {
                        history.back();
                    }}
                >
                    X
                </Button>
                <form onSubmit={handleSubmit(onSubmit)} className={cx('search-container')}>
                    <div className={cx('menu')}>
                        <label>Tìm kiếm theo :</label>
                        <Controller
                            name="input_option"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <select {...field} className={cx('select')}>
                                    <option value="serial">Serial</option>
                                    <option value="name">Tên</option>
                                </select>
                            )}
                        />
                    </div>
                    <div className={cx('form-search')}>
                        <input
                            className={cx('form-box')}
                            placeholder="Tìm kiếm"
                            {...register('input', {
                                required: 'Vui lòng nhập thông tin tìm kiếm',
                            })}
                        ></input>
                        <p className={cx('error')}>{errors.input?.message}</p>
                    </div>
                    <Button primary type="submit" className={cx('search-btn')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </Button>
                </form>
                <div className={cx('device-infor')}>
                    <h1>Bảng danh sách thiết bị </h1>
                    <div className={cx('table-2')}>
                        <div className={cx('ag-theme-alpine')} style={{ width: 1610, height: 550, color: 'red' }}>
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
}

export default SearchDevice;
