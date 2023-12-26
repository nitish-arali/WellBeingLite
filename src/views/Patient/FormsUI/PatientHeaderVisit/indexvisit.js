//import React from 'react';
import Avatar from '@mui/material/Avatar';
import male from '../../../../assets/images/m.png';
import female from '../../../../assets/images/f.png';
import defaultPic from '../../../../assets/images/defaultPic.png';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useState } from 'react';
import Chip from '@mui/material/Chip'; // Import Chip component
import CreateVisitDialog from '../CreatevisitDialog/visitdialog';
import EditRegistrationDialog from '../EditRegestrationDetails/index.js';

function PatientHeaderVisit({ patientdata }) {
    function showGenderPic(patientdata) {
        if (patientdata?.Gender === 7) {
            return male;
        }
        if (patientdata?.Gender === 8) {
            return female;
        } else {
            return defaultPic;
        }
    }

    function showGender(patientdata) {
        if (patientdata?.Gender === 7) {
            return 'Male';
        }
        if (patientdata?.Gender === 8) {
            return 'Female';
        } else {
            return 'N/A';
        }
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    }
    const formattedDate = formatDate(patientdata?.DateOfBirth);
    const dateOfBirth = formattedDate === 'Invalid Date' ? 'N/A' : formattedDate;

    function calculateAge(dateString) {
        const parts = dateString.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        const birthDate = new Date(year, month - 1, day);
        const currentDate = new Date();

        let yearsDiff = currentDate.getFullYear() - birthDate.getFullYear();
        let monthsDiff = currentDate.getMonth() - birthDate.getMonth();
        let daysDiff = currentDate.getDate() - birthDate.getDate();

        // Adjust age components based on negative values
        if (daysDiff < 0) {
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
            daysDiff += lastDayOfMonth;
            monthsDiff--;
        }
        if (monthsDiff < 0) {
            monthsDiff += 12;
            yearsDiff--;
        }
        if (!yearsDiff) {
            return 'N/A';
        }
        return `${yearsDiff}Y ${monthsDiff}M ${daysDiff}D`;
    }
    const age = calculateAge(dateOfBirth);
    const encounterId = patientdata?.GeneratedEncounterId; // Extract encounterId from patientdata

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const moreDetails = () => {
        // Handle the "More Details" action here
        handleMenuClose();
    };

    const [isCreateVisitDialogOpen, setCreateVisitDialogOpen] = useState(false);
    const [isEditRegistrationDialogOpen, setEditRegistrationDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null); // State to store the selected patient data

    const handleCreateVisit = () => {
        // Ensure that the dialog is not already open before opening it
        if (!isCreateVisitDialogOpen) {
            setCreateVisitDialogOpen(true);
            setSelectedPatient(patientdata);
        }
        handleMenuClose();
    };
    
    const handleCloseDialog = () => {
        // Close the CreateVisitDialog and clear the selected patient data
        setCreateVisitDialogOpen(false);
        setSelectedPatient(null);
    };
    
    const handleOpenEditRegistrationDialog = () => {
        // Ensure that the dialog is not already open before opening it
        if (!isEditRegistrationDialogOpen) {
            setEditRegistrationDialogOpen(true);
            setSelectedPatient(patientdata);
        }
        handleMenuClose(); // Close the menu
    };
    
    const handleCloseEditRegistrationDialog = () => {
        // Close the EditRegistrationDialog and clear the selected patient data
        setEditRegistrationDialogOpen(false);
        setSelectedPatient(null);
    };



    const patientContent = (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={1}>
                <Avatar src={showGenderPic(patientdata)} sx={{ width: 60, height: 60 }} />
            </Grid>
            <Grid item xs={3} sx={{ padding: '8px' }}>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700' }}>UhId:</span> {patientdata?.UhId || 'N/A'}
                </Typography>
                <Typography variant="body2">
                    <span style={{ fontWeight: '700' }}>VisitId:</span>
                    {encounterId ? (
                        <Chip label={encounterId} size="small" color="secondary" />
                    ) : (
                        'N/A'
                    )}
                </Typography>
            </Grid>
            <Grid item xs={4} sx={{ padding: '8px' }}>
                <Typography variant="body1" sx={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700' }}>{patientdata?.PatientName || 'N/A'}</span>
                </Typography>
                <Typography variant="body2">{age}</Typography>
            </Grid>
            <Grid item xs={1.5} sx={{ padding: '8px', position: 'relative' }}>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                    {showGender(patientdata)}
                </Typography>
                <Typography variant="body2">{dateOfBirth}</Typography>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '12px',
                        bottom: 0,
                        left: 'calc(100%)', // Add space between text and divider
                        width: '1px',
                        backgroundColor: 'black'
                    }}
                ></Box>
            </Grid>
            <Grid item xs={2.5} sx={{ padding: '8px', display: 'flex', justifyContent: 'space-around' }}>
                <IconButton
                    aria-label="more"
                    aria-controls="patient-menu"
                    aria-haspopup="true"
                    onClick={handleMenuClick}
                >
                    <MoreVertIcon fontSize="large" />
                </IconButton>
                <Menu
                    id="patient-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleCreateVisit}>Create Visit</MenuItem>
                    <MenuItem onClick={moreDetails}>More Details</MenuItem>
                    <MenuItem onClick={handleOpenEditRegistrationDialog}>Edit Reg Details</MenuItem>
                </Menu>
            </Grid>
            {/* Add the CreateVisitDialog component */}
            {isCreateVisitDialogOpen  && (
                <CreateVisitDialog
                isOpen={isCreateVisitDialogOpen}
                onClose={handleCloseDialog}
                selectedRow={selectedPatient}
            />
            )}

            {isEditRegistrationDialogOpen && (
                <EditRegistrationDialog
                    open={isEditRegistrationDialogOpen}
                    onClose={handleCloseEditRegistrationDialog}
                    selectedRow={selectedPatient}
                />
            )}

        </Grid>
    );


    return (
        <Box
            width={'100%'}
            height={'80px'}
            border={3}
            borderColor="#efebe9"
            // backgroundColor="#ECF2FF"
            borderRadius={2}
            display="flex"
            alignItems="center"
            justifyContent="space-evenly"
            p={2}
            mb={2}
        >
            {patientContent}
        </Box>
    );
}

export default PatientHeaderVisit;
