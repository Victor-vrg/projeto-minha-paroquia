import React, { MouseEvent, useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, styled } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NavigationRail from './NavigationRail';
import '@fontsource/roboto/400.css';

const MyAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#fff',
  boxShadow: 'none', // Remova a sombra para evitar que borre o conteúdo
}));

const MyTypography = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  lineHeight: '1.2',
  color: '#333',
  padding: '10px',
  textAlign: 'center',
  flexGrow: 1,
}));

const MyIconButton = styled(IconButton)(({ theme }) => ({
  color: '#333',
  marginRight: '20px',
  cursor: 'pointer',
}));

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
    // Implemente a lógica para sair
  };

  const handleEditProfile = () => {
    // Implemente o redirecionamento para a página de edição de perfil (futuro)
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
    <MyAppBar>
      <Toolbar>
        {windowWidth >= 601 ? <NavigationRail /> : null}
        <MyTypography variant="h6">
          Nome da Paróquia
        </MyTypography>
        <MyIconButton
          onClick={handleMenuOpen}
          edge="end"
          color="inherit"
          aria-label="menu do usuário"
        >
          <AccountCircleIcon />
        </MyIconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditProfile}>
            Editar Perfil
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            Sair
          </MenuItem>
        </Menu>
      </Toolbar>
    </MyAppBar>
  );
};

export default Header;
