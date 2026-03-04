import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { BarChartOutlined } from '@mui/icons-material';

interface TrafficStatsEditHeaderProps {
    dataLength: number;
    isLoading: boolean;
}

const TrafficStatsEditHeader = ({ dataLength, isLoading }: TrafficStatsEditHeaderProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                background: 'linear-gradient(120deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)',
                px: { xs: 2.5, sm: 4 },
                py: { xs: 2, sm: 2.5 },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.3 }}>
                <BarChartOutlined sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 22 }} />
                <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    fontWeight={700}
                    sx={{ color: 'white', lineHeight: 1.2 }}
                >
                    Traffic Statistics Edit Form
                </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {isLoading ? 'Loading entries…' : `${dataLength.toLocaleString()} existing entries`}
            </Typography>
        </Box>
    );
};

export default TrafficStatsEditHeader;

