import React, { MouseEvent, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import '../styles/header.css';

const Header: React.FC = () => {
  // State para controlar o menu do usuário
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Função para abrir o menu do usuário
  // Função para fechar o menu do usuário
  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Função para lidar com a ação de sair
  const handleLogout = () => {
    // Implementar a lógica para sair
  };

  // Função para lidar com a ação de editar perfil
  const handleEditProfile = () => {
    // Implementar aqui o redirecionamento para a página de edição de perfil painel adm (futuro)
  };

  return (
    <AppBar id="meu-cabecalho" className='meu-cabecalho' >
  <Toolbar>
    <Typography variant="h6" className="meu-titulo">
      Nome da Paróquia
    </Typography>
    <IconButton
      onClick={handleMenuOpen}
      edge="end"
      color="inherit"
      aria-label="menu do usuário"
      className="meu-botao" 
    >
      <AccountCircleIcon />
    </IconButton>
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
