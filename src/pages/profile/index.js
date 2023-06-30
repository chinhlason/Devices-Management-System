import httpRequest from '~/utils/htppRequest';
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const USER_URL = '/user/list';

function Profile() {
    const navigate = useNavigate();
    const handleChange = (id) => {
        navigate(`/update?id=${id}`);
    };
    const handleDisable = (id) => {
        console.log('Disable user with ID:', id);
    };
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const defaultColDef = useMemo(
        () => ({
            sortable: true,
        }),
        [],
    );
    const columnDefs = useMemo(
        () => [
            { field: 'fullname', headerName: 'Username', filter: true },
            { field: 'username', headerName: 'Tên người dùng', filter: true },
            { field: 'roles', headerName: 'Quyền hạn', filter: true },
            { field: 'email', headerName: 'Email' },
            { field: 'phone', headerName: 'Số điện thoại', filter: true },
            { field: 'birthDate', headerName: 'Ngày sinh', filter: true },
            { field: 'joinDate', headerName: 'Ngày tạo', filter: true },
            { field: 'tenPhong', headerName: 'Tên Phòng', filter: true },
            { field: 'tenBan', headerName: 'Tên Ban', filter: true },
            { field: 'tenVien', headerName: 'Tên viện', filter: true },
        ],
        [],
    );

    useEffect(() => {
        getAll();
    }, []);

    const getAll = () => {
        httpRequest
            .get(USER_URL, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                setRowData(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    const cellClickedListener = useCallback((event) => {
        console.log('cellClicked', event);
    }, []);

    const rowClickedListener = useCallback((event) => {
        console.log('rowClicked', event);
    }, []);

    const cellContextMenuListener = useCallback((params) => {
        params.event.preventDefault();
        const selectedRow = params.node.data;
        const username = selectedRow.username;
        const options = {
            change: {
                name: 'Thay đổi thông tin',
                action: () => handleChange(username),
            },
            disable: {
                name: 'Vô hiệu hoá tài khoản',
                action: () => handleDisable(username),
            },
        };
        showContextMenu(params.event.clientX, params.event.clientY, options);
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

    return (
        <div className="ag-theme-alpine" style={{ width: 1500, height: 500 }}>
            <button onClick={handleSignup}>Thêm người dùng</button>
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
    );
}

export default Profile;
