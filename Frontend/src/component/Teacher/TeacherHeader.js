import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useEffect } from 'react';
import SchoolIcon from '@mui/icons-material/School';
const settings = ['Dashboard', 'Logout','Your Details'];
// 'Profile', 'Account', 
function TeacherHeader() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (route) => {
    navigate(route);
    handleCloseNavMenu();
  };

  function clearAllCookies() {
    const cookies = document.cookie.split(";");
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  
    //window.location.href = "/login";
    document.location.reload();
    return;
  }

  const handleSettingClick = (setting) => {
    switch (setting) {
      case 'Dashboard':
        navigate('/teacher-dashboard');
        break;
      case 'Logout':
        clearAllCookies();
        break;
      case 'Your Details':
        navigate('/teacher-deatils');
        break
      default:
        // Handle other settings if necessary
        break;
    }
    handleCloseUserMenu();
  };

  useEffect(()=>{
    window.scrollTo(0, 0);
    const cookies = document.cookie;

    console.log(cookies);

    if (!cookies) {
      navigate("/login");
      return;
    }

    const roleCookie = cookies.split("; ").find(row => row.startsWith("role="));


    console.log(roleCookie);
    if (!roleCookie) {
      navigate("/login");
      return
    }

    const roleValue = roleCookie.split("=")[1]; // Get the value after 'role='
    const role = roleValue.split("/")[0]; // Extract the role before the "/"
      
    if(role!=='teacher'){
      navigate("/login");
      return
    }

    
  },[])

  return (
    <AppBar position='fixed' >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem onClick={() => handleMenuItemClick('/teacher-dashboard')}>
                <Typography sx={{ textAlign: 'center' }}>Teacher Dashboard</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('/add-assignment')}>
                <Typography sx={{ textAlign: 'center' }}>Add Assignment</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('/add-no-code-assignment')}>
                <Typography sx={{ textAlign: 'center' }}>Add Assignment (No code)</Typography>
              </MenuItem>

              
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={() => handleMenuItemClick('/teacher-dashboard')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Teacher Dashboard
            </Button>
            <Button
              onClick={() => handleMenuItemClick('/add-assignment')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Add Assignment
            </Button>
            <Button
              onClick={() => handleMenuItemClick('/add-no-code-assignment')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Add Assignment (No Code)
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp"  >
                  <SchoolIcon alt="Remy Sharp"   />
                </Avatar>
              </IconButton>

             
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleSettingClick(setting)}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default TeacherHeader;
