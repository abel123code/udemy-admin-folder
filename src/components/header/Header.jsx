import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function Header() {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setIsDrawerOpen(open);
    };

    useEffect(() => {
        // Check for accessToken in localStorage
        const token = localStorage.getItem('accessToken');
        setIsLogin(!!token); // Convert token presence to boolean
    }, []);

    const handleLogout = () => {
        // Remove items from local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('details');
        setIsLogin(false);
        navigate('/');
    };

    const drawerOptions = [
        'User Management','Admin Registration', 'Course Management', 'Transaction Oversight', 'Analytics and Reporting'
    ];

    const list = () => (
        <Box
            sx={{ width: '100%' }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {isLogin ? 
                    [...drawerOptions, 'Sign Out'].map((text, index) => (
                        <ListItem button key={text} onClick={text === 'Sign Out' ? handleLogout : () => navigate(`/${text.replace(/\s+/g, '')}`)}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))
                :
                    [...drawerOptions, 'Login'].map((text) => (
                        <ListItem button key={text} onClick={text === 'Login' ? () => navigate('/') : () => navigate(`/${text.replace(/\s+/g, '')}`)}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))
                }
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ margin: 0, padding: 0,  backgroundColor: 'white', color: 'black' }}>
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor={'left'}
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
            >
                {list()}
            </Drawer>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Admin Dashboard
            </Typography>
            <Button color="inherit">
                {isLogin ? 'Welcome' : 'Login'}
            </Button>
            </Toolbar>
        </AppBar>
        </Box>
    );
}
