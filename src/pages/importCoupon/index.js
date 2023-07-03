import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import httpRequest from '~/utils/htppRequest';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useNavigate } from 'react-router-dom';

import styles from './importCoupon.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const IMPORT_URL = '/phieunhap/list';

function ImportCoupon() {
    const [importCoupon, setImportCoupon] = useState([]);

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
            { field: 'id', headerName: 'ID', filter: true },
            { field: 'companyName', headerName: 'Đơn vị cung cấp', filter: true },
            { field: 'exporter', headerName: 'Người tiếp nhận', filter: true },
            { field: 'number', headerName: 'Số lượng sản phẩm', filter: true },
            { field: 'name', headerName: 'Tên sản phẩm' },
            { field: 'dateImport', headerName: 'Ngày nhập', filter: true },
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
                console.log(data);
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
    return (
        <>
            <div className={cx('back-ground-img')}></div>

            {!isOpenMiniPage ? (
                <div className={cx('wrapper')}>
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
                </div>
            ) : (
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

                    <div className={cx('table-2')}>
                        <div className="ag-theme-alpine" style={{ width: 1010, height: 500 }}>
                            <h2>Bảng thiết bị nhập({dataMiniPage.number})</h2>
                            <AgGridReact
                                ref={gridRef}
                                rowData={dataMiniTable}
                                columnDefs={columnDefsmini}
                                defaultColDef={defaultColDef}
                                animateRows={true}
                            />
                        </div>
                    </div>
                    <Button className={cx('button')} primary onClick={handleCancel}>
                        Huỷ
                    </Button>
                </div>
            )}
        </>
    );
}

export default ImportCoupon;
