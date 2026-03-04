import { IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import { BarChartOutlined, MenuOutlined } from '@mui/icons-material';

interface LayoutAppBarProps {
    onMenuClick: () => void;
}

const LayoutAppBar = ({ onMenuClick }: LayoutAppBarProps) => {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: 'linear-gradient(120deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
        >
            <Toolbar sx={{ gap: 1.5 }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open navigation menu"
                    onClick={onMenuClick}
                    sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}
                >
                    <MenuOutlined />
                </IconButton>

                <BarChartOutlined sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 22 }} />

                <Typography variant="h6" fontWeight={700} sx={{ color: 'white', letterSpacing: '0.01em' }}>
                    Traffic Statistics
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default LayoutAppBar;

