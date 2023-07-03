import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import httpRequest from '~/utils/htppRequest';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import styles from './categoryDevice.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const CATEGORY_URL = '/category/list';

function CategoryDevice() {
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
    const cellClickedListener = useCallback((event) => {
        console.log('cellClicked', event);
    }, []);

    const rowClickedListener = useCallback((event) => {
        console.log('rowClicked', event);
    }, []);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    useEffect(() => {
        httpRequest
            .get(`/device/list-by-category-name?categoryName=${category}`, { withCredentials: true })
            .then((response) => {
                const data = response.data; // Assuming the response is an array of objects
                console.log(data);
                setRowData(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [category]);
    return (
        <div>
            <div className={cx('back-ground-img')}></div>
            <div className={cx('wrapper')}>
                <div className={cx('table')}>
                    <div className="ag-theme-alpine" style={{ width: 1610, height: 630 }}>
                        <h1>Danh sách sản phẩm thuộc danh mục {category}</h1>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            animateRows={true}
                            onCellClicked={cellClickedListener}
                            onRowClicked={rowClickedListener}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryDevice;
