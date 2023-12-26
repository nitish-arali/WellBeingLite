import React from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { styled } from '@mui/system';
import Tooltip from '@mui/material/Tooltip';

const CustomTextarea = styled(TextareaAutosize)({
  width: '100%',
  resize: 'none',
  fontFamily: 'sans-serif',
  fontSize: '0.875rem',
  fontWeight: '400',
  lineHeight: 1.5,
  padding: '8px 12px',
  borderRadius: '8px',
  backgroundColor: '#F8FAFC',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  borderColor: '#F8FAFC',
  '&:hover': {
    borderColor: '#3399FF'
  },
  '&:focus': {
    borderColor: '#3399FF',
    boxShadow: '0 0 0 3px #b6daff'
  }
});

const TextareaWithTooltip = ({ value, onChange, placeholder, tooltipText }) => {
  return (
    <Tooltip title={tooltipText} arrow>
      <CustomTextarea
        aria-label="minimum height"
        minRows={2}
        maxRows={3}
        placeholder={placeholder || 'Description'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Tooltip>
  );
};

const Textarea = ({ value, onChange, placeholder }) => {
  const tooltipText = 'Press Enter Key to Print Next Line In report'; // Tooltip text

  return <TextareaWithTooltip value={value} onChange={onChange} placeholder={placeholder} tooltipText={tooltipText} />;
};

export default Textarea;
