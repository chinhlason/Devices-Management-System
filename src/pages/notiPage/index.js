import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import httpRequest from '~/utils/htppRequest';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useNavigate } from 'react-router-dom';
const REQUEST_URL = '/warrantycard/list-unconfirm';

function NotiPage() {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [saveData, setSaveData] = useState([]);
    const [alertShown, setAlertShown] = useState(false);
    const navigate = useNavigate();
    let count = 0;
    const columnDefs = useMemo(
        () => [
            { field: 'id', headerName: 'ID', filter: true },
            { field: 'type', headerName: 'Loại yêu cầu', filter: true },
            { field: 'receiver', headerName: 'Người gửi', filter: true },
            { field: 'note', headerName: 'Ghi chú' },
            { field: 'serial', headerName: 'Serial', filter: true },
            { field: 'tenPhong', headerName: 'Tên phòng', filter: true },
            { field: 'tenBan', headerName: 'Tên ban', filter: true },
            { field: 'tenVien', headerName: 'Tên viện', filter: true },
            {
                headerName: '',
                field: 'actions',
                cellRenderer: ({ data }) => (
                    <div>
                        <button
                            onClick={() => {
                                handleAccess(data);
                            }}
                        >
                            Chấp nhận
                        </button>
                    </div>
                ),
                width: 100,
                suppressMenu: true,
                sortable: false,
                filter: false,
            },
            {
                headerName: '',
                field: 'actions',
                cellRenderer: ({ data }) => (
                    <div>
                        <button
                            onClick={() => {
                                handleDeny(data);
                            }}
                        >
                            Từ chối
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
    return (
        <div className="ag-theme-alpine" style={{ width: 1500, height: 500 }}>
            <h1>Danh sách yêu cầu bảo hành, bảo trì</h1>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                animateRows={true}
            />
        </div>
    );
}

export default NotiPage;
