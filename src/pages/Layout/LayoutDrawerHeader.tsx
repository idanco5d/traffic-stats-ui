import { Box, Typography } from '@mui/material';
import { BarChartOutlined } from '@mui/icons-material';
const LayoutDrawerHeader = () => {
    return (
        <Box
            sx={{
                background: 'linear-gradient(120deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)',
                px: 3,
                py: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
            }}
        >
            <BarChartOutlined sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 22 }} />
            <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'white', lineHeight: 1.2 }}>
                    Traffic Statistics
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                    Navigation
                </Typography>
            </Box>
        </Box>
    );
};
export default LayoutDrawerHeader;
