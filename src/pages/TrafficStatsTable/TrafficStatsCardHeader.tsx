import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

interface TrafficStatsCardHeaderProps {
    dataLength: number | null;
    isLoading: boolean;
}

const TrafficStatsCardHeader = ({ dataLength, isLoading }: TrafficStatsCardHeaderProps) => {
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
            <Typography
                variant={isMobile ? 'h6' : 'h5'}
                fontWeight={700}
                sx={{ color: 'white', lineHeight: 1.2 }}
            >
                Traffic Statistics
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.3 }}>
                {!isLoading && dataLength
                    ? `${dataLength.toLocaleString()} total entries`
                    : 'Loading…'}
            </Typography>
        </Box>
    );
};

export default TrafficStatsCardHeader;

