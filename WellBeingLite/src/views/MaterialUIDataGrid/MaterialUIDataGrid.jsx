// MaterialUIDataGrid.js
import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const MaterialUIDataGrid = ({ rows, columns }) => {
  const [selectionModel, setSelectionModel] = useState([]);

  const handleSelectionModelChange = (newSelection) => {
    debugger;
    setSelectionModel(newSelection.selectionModel);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        onSelectionModelChange={handleSelectionModelChange}
        selectionModel={selectionModel}
      />
    </div>
  );
};

export default MaterialUIDataGrid;
