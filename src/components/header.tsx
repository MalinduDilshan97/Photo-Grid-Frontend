import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Header() {
    return (
        <Box sx={{flexGrow: 1}} paddingBottom={'20px'}>
            <AppBar position="static" color={"default"}>
                <Toolbar>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            textDecoration: 'none',
                            color: 'black'
                        }}
                    >
                        Image Grid
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
