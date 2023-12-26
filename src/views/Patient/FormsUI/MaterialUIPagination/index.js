// MaterialUIPagination.jsx
import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function MaterialUIPagination({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (event, page) => {
    onPageChange(page);
  };

  return (
    <Stack direction="row" spacing={2} justifyContent="center" >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
    </Stack>
  );
}

export default MaterialUIPagination;
