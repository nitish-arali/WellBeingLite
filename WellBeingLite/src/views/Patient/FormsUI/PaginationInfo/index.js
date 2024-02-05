// PaginationInfo.jsx
import React from 'react';

function PaginationInfo({ startRange, endRange, totalItems }) {
  return (
    <div>
      {`Showing ${startRange}-${endRange} of ${totalItems} patients`}
    </div>
  );
}

export default PaginationInfo;
