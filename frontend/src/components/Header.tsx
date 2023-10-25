import React, { MouseEvent, useState, useEffect} from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import EventIcon from "@mui/icons-material/Event";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import "@fontsource/roboto/400.css";
import '../styles/header.css';

interface HeaderProps {
  nomeParoquia: string;
}

const Header: React.FC<HeaderProps> = ({ nomeParoquia }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

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

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleResize = () => {
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="header">
      <AppBar className="header-bar">
        <Toolbar className="toolbar">
          <IconButton
            onClick={toggleDrawer}
            edge="start"
            color="inherit"
            aria-label="menu de navegação"
            className="botão-de-navegação"
          >
            <MenuIcon />
          </IconButton>
          <Typography className="nome-paroquia" variant="h6">
            {nomeParoquia}
          </Typography>
          <IconButton
            onClick={handleMenuOpen}
            edge="end"
            color="inherit"
            aria-label="menu do usuário"
            className="botão-de-perfil"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEditProfile}>Editar Perfil</MenuItem>
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <List>
          <ListItem button onClick={() => scrollToSection("eventos")}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Eventos" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("excursao")}>
            <ListItemIcon>
              <FlightTakeoffIcon />
            </ListItemIcon>
            <ListItemText primary="Excursões" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("entre-em-contato")}>
            <ListItemIcon>
              <ContactSupportIcon />
            </ListItemIcon>
            <ListItemText primary="Entre em Contato" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default Header;
