import React, { MouseEvent, useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import '../styles/header.css';
import NavigationDrawer from './NavigationDrawer';

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Implementar a lógica para sair
  };

  const handleEditProfile = () => {
    // Implementar aqui o redirecionamento para a página de edição de perfil (futuro)
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <AppBar id="meu-cabecalho" className="meu-cabecalho">
      <Toolbar>
        {windowWidth >= 601 ? <NavigationDrawer /> : null}
        <Typography variant="h6" className="meu-titulo">
          Nome da Paróquia
        </Typography>
        {windowWidth < 601 ? (
          <IconButton
            onClick={handleMenuOpen}
            edge="end"
            color="inherit"
            aria-label="menu do usuário"
            className="meu-botao"
          >
            <AccountCircleIcon />
          </IconButton>
        ) : null}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className="meu-menu"
        >
          <MenuItem onClick={handleEditProfile} className="meu-item-menu">
            Editar Perfil
          </MenuItem>
          <MenuItem onClick={handleLogout} className="meu-item-menu">
            Sair
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
