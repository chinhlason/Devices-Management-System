import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import httpRequest from '~/utils/htppRequest';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useNavigate } from 'react-router-dom';
const WARRANTY_URL = '/warrantycard/list';
function WarrantyCoupon() {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [dataMiniPage, setDataMiniPage] = useState([]);
    const [dataMiniTable, setDataMiniTable] = useState([]);
    const [isOpenMiniPage, setIsOpenMiniPage] = useState(false);
    const navigate = useNavigate();
    const [warrantyCoupon, setWarrantyCoupon] = useState([]);
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
                date: element.date,
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
            { field: 'name', headerName: 'TÊN THIẾT BỊ', filter: true },
            { field: 'serial', headerName: 'SERIAL', filter: true },
            { field: 'price', headerName: 'Giá tiền' },
            { field: 'warrantyTime', headerName: 'Thời hạn bảo hành', filter: true },
            { field: 'maintenanceTime', headerName: 'Chu kì bảo trì', filter: true },
            { field: 'warrantyStatus', headerName: 'Trạng thái bảo hành', filter: true },
            { field: 'maintenanceStatus', headerName: 'Trạng thái bảo trì', filter: true },
        ],
        [],
    );

    const columnDefs = useMemo(
        () => [
            { field: 'id', headerName: 'ID', filter: true },
            { field: 'date', headerName: 'Ngày tạo phiếu', filter: true },
            { field: 'handoverDate', headerName: 'Ngày bàn giao', filter: true },
            { field: 'receiver', headerName: 'Người yêu cầu', filter: true },
            { field: 'confirmer', headerName: 'Người xác nhận' },
            { field: 'note', headerName: 'Ghi chú', filter: true },
            { field: 'name', headerName: 'Tên sản phẩm', filter: true },
            { field: 'serial', headerName: 'Serial', filter: true },
            { field: 'status', headerName: 'Trạng thái bảo hành', filter: true },
            { field: 'confirmStatus', headerName: 'Trạng thái xác nhận', filter: true },
            {
                headerName: '',
                field: 'actions',
                cellRenderer: ({ data }) => (
                    <div>
                        <button
                            onClick={() => {
                                handleMenuClick(data);
                            }}
                        >
                            Xem chi tiết
                        </button>
                    </div>
                ),
                width: 100,
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
                console.log(data);
                const dataImport = {
                    id: data.id,
                    date: data.date,
                    handoverDate: data.handoverDate,
                    receiver: data.receiver,
                    confirmer: data.confirmer,
                    note: data.note,
                    status: data.status,
                    confirmStatus: data.confirmStatus,
                };
                console.log(data.device);
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
                console.log('s', devices);
                setDataMiniTable([devices]);
                console.log('ss', dataMiniTable);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleCancel = () => {
        setIsOpenMiniPage(false);
        navigate('/warrantycoupon');
    };
    return (
        <>
            {!isOpenMiniPage ? (
                <div className="ag-theme-alpine" style={{ width: 1500, height: 500 }}>
                    <h1>Danh sách phiếu bảo hành</h1>
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        animateRows={true}
                    />
                </div>
            ) : (
                <div className="ag-theme-alpine" style={{ width: 1500, height: 100 }}>
                    <h1>Chi tiết phiếu bảo hành</h1>
                    <p>ID phiếu bảo hành : {dataMiniPage.id}</p>
                    <p>Ngày tạo phiếu : {dataMiniPage.date}</p>
                    <p>Ngày bàn giao : {dataMiniPage.handoverDate}</p>
                    <p>Người yêu cầu : {dataMiniPage.receiver}</p>
                    <p>Người xác nhận: {dataMiniPage.confirmer}</p>
                    <p>Ghi chú : {dataMiniPage.note}</p>
                    <p>Trạng thái bảo hành : {dataMiniPage.status}</p>
                    <p>Trạng thái xác nhận : {dataMiniPage.confirmStatus}</p>
                    <AgGridReact
                        ref={gridRef}
                        rowData={dataMiniTable}
                        columnDefs={columnDefsmini}
                        defaultColDef={defaultColDef}
                        animateRows={true}
                    />
                    <button onClick={handleCancel}>Huỷ</button>
                </div>
            )}
        </>
    );
}

export default WarrantyCoupon;
