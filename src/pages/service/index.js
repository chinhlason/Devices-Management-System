import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import httpRequest from '~/utils/htppRequest';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useNavigate } from 'react-router-dom';
const DEVICE_URL = '/device/list';

const Service = () => {
    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
    const navigate = useNavigate();
    const columnDefs = useMemo(
        () => [
            { field: 'name', headerName: 'TÊN THIẾT BỊ', filter: true },
            { field: 'serial', headerName: 'SERIAL', filter: true },
            { field: 'price', headerName: 'Giá tiền' },
            { field: 'warrantyTime', headerName: 'Thời hạn bảo hành', filter: true },
            { field: 'maintenanceTime', headerName: 'Chu kì bảo trì', filter: true },
            { field: 'status', headerName: 'Trạng thái xuất', filter: true },
            { field: 'warrantyStatus', headerName: 'Trạng thái bảo hành', filter: true },
            { field: 'maintenanceStatus', headerName: 'Trạng thái bảo trì', filter: true },
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

    // Example of consuming Grid Event
    const cellClickedListener = useCallback((event) => {
        console.log('cellClicked', event);
    }, []);

    const rowClickedListener = useCallback((event) => {
        console.log('rowClicked', event);
    }, []);
    // Example load data from server
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
            update: {
                name: 'Cập nhật thông tin',
                action: () => handleUpdate(dataResponse),
            },
            export: {
                name: 'Tạo phiếu xuất',
                action: () => handleExport(dataResponse),
            },
            warrantyState: {
                name: 'Chỉnh sửa trạng thái bảo trì',
                action: () => handleWarrantyState(dataResponse),
            },
            maintainanceState: {
                name: 'Chỉnh sửa trạng thái bảo hành',
                action: () => handleMaintainanceState(dataResponse),
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
        const queryParams = new URLSearchParams();
        queryParams.append('serial', data.serial);
        queryParams.append('role', 'ROLE_ADMIN');
        navigate(`/updatedevice?${queryParams.toString()}`);
    };

    const handleExport = (data) => {
        const queryParams = new URLSearchParams();
        queryParams.append('serial', data.serial);
        queryParams.append('role', 'ROLE_ADMIN');
        navigate(`/exportdevice?${queryParams.toString()}`);
    };

    const handleWarrantyState = () => {
        console.log(3);
    };

    const handleMaintainanceState = () => {
        console.log(4);
    };

    const handleAdd = () => {
        navigate('/adddevice?role=ROLE_ADMIN');
    };

    const handleExportList = () => {
        navigate('/exportlistdevice?role=ROLE_ADMIN');
    };

    return (
        <div>
            <button onClick={handleAdd}>Nhập thiết bị</button>
            <button onClick={handleExportList}>Xuất thiết bị</button>
            <button>Tìm kiếm </button>
            <div className="ag-theme-alpine" style={{ width: 1500, height: 500 }}>
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
    );
};

export default Service;
