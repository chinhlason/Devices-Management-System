import httpRequest from '~/utils/htppRequest';
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import styles from './profile.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

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
    const [showDetail, setShowDetail] = useState([]);
    const [showInfor, setShowInfor] = useState(false);

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
        }),
        [],
    );
    const columnDefs = useMemo(
        () => [
            { field: 'username', headerName: 'Username', filter: true, width: 140 },
            { field: 'fullname', headerName: 'Tên người dùng', filter: true, width: 200 },
            { field: 'roles', headerName: 'Quyền hạn', filter: true, width: 140 },
            { field: 'email', headerName: 'Email', width: 220 },
            { field: 'phone', headerName: 'Số điện thoại', filter: true, width: 140 },
            { field: 'birthDate', headerName: 'Ngày sinh', filter: true, width: 140 },
            { field: 'joinDate', headerName: 'Ngày tạo', filter: true },
            { field: 'tenPhong', headerName: 'Tên Phòng', filter: true, width: 140 },
            { field: 'tenBan', headerName: 'Tên Ban', filter: true, width: 140 },
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
            detail: {
                name: 'Chi tiết người dùng',
                action: () => handleDetail(username),
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

    const handleDetail = (username) => {
        httpRequest
            .get(`/user?username=${username}`, { withCredentials: true })
            .then((response) => {
                const data = response.data; // Assuming the response is an array of objects
                setShowDetail(data);
                setShowInfor(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    console.log(showDetail);
    return (
        <div className={cx('mainpage', { hide: showInfor })}>
            <div className={cx('back-ground-img')}></div>

            <div className={cx('wrapper')}>
                <div className={cx('table', { hide: showInfor, show: showInfor })}>
                    <div className={cx('overlay', { show: showInfor })}></div>
                    <h1>Bảng danh sách người dùng</h1>
                    <div className="ag-theme-alpine" style={{ width: 1670, height: 500 }}>
                        <Button className={cx('button')} primary onClick={handleSignup}>
                            Thêm người dùng
                        </Button>
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

                <div className={cx('user-infor', { show: showInfor })}>
                    <Button
                        className={cx('button-cancel')}
                        primary
                        onClick={() => {
                            setShowInfor(false);
                        }}
                    >
                        X
                    </Button>
                    <h2>Thông tin người dùng {showDetail.username}</h2>
                    <p>Tên tài khoản : {showDetail.username}</p>
                    <p>Tên người dùng : {showDetail.fullname}</p>
                    <p>Vai trò : {showDetail.roles}</p>
                    <p>Email : {showDetail.email}</p>
                    <p>Ngày sinh : {showDetail.birthDate}</p>
                    <p>Số điện thoại : {showDetail.phone}</p>
                    <p>Ngày tạo tài khoản : {showDetail.joinDate}</p>
                    <p>Tên viện : {showDetail.tenVien}</p>
                    <p>Tên phòng : {showDetail.tenPhong}</p>
                    <p>Tên ban : {showDetail.tenBan}</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
