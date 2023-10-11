import React from 'react';
import { Paper, Button, Stack } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

const NavigationBar: React.FC = () => {
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        height: '80px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        '@media (min-width: 601px)': {
          display: 'none', 
        },
      }}
    >
      <Stack direction="column" alignItems="center">
        <Button
          startIcon={<EventIcon />}
          size="small"
          sx={{ flexDirection: 'column', gap: '4px' }} 
        >
          Eventos
        </Button>
      </Stack>
      <Stack direction="column" alignItems="center">
        <Button
          startIcon={<FlightTakeoffIcon />}
          size="small"
          sx={{ flexDirection: 'column', gap: '4px' }} 
        >
          Excursões
        </Button>
      </Stack>
    </Paper>
  );
};

export default NavigationBar;
