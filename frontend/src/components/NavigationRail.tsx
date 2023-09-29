import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import EventIcon from '@mui/icons-material/Event';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

const NavigationRail: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="navigation-drawer">
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <List
          sx={{
            width: 250,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            height: '100%',
          }}
        >
          <ListItem button onClick={toggleDrawer}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Eventos" />
          </ListItem>
          <ListItem button onClick={toggleDrawer}>
            <ListItemIcon>
              <FlightTakeoffIcon />
            </ListItemIcon>
            <ListItemText primary="Excursões" />
          </ListItem>
        </List>
      </Drawer>
      <IconButton
        onClick={toggleDrawer}
        className={`menu-button ${open ? 'menu-open' : ''}`}
      >
        <MenuIcon />
      </IconButton>
    </div>
  );
};

export default NavigationRail;
