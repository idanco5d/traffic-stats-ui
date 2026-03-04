import {Box, CardContent, Skeleton, useMediaQuery, useTheme} from '@mui/material';
import {LineChart} from '@mui/x-charts/LineChart';
import type {ViewMode} from './chartUtils';

interface TrafficStatsChartContentProps {
    isLoading: boolean;
    xLabels: string[];
    yValues: number[];
    viewMode: ViewMode;
}

const TrafficStatsChartContent = ({ isLoading, xLabels, yValues, viewMode }: TrafficStatsChartContentProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const chartHeight = isMobile ? 260 : isTablet ? 340 : 420;

    return (
        <CardContent sx={{ p: 0, pb: '0 !important' }}>
            {isLoading ? (
                <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Skeleton variant="rounded" width="100%" height={chartHeight} />
                </Box>
            ) : (
                <Box sx={{ px: { xs: 0, sm: 1 }, pt: 2, pb: 1 }}>
                    <LineChart
                        xAxis={[
                            {
                                scaleType: 'point',
                                data: xLabels,
                                tickLabelStyle: {
                                    fontSize: isMobile ? 10 : 12,
                                    fill: '#64748b',
                                },
                                // Show fewer ticks on mobile to avoid crowding
                                tickInterval: isMobile
                                    ? (_value: unknown, index: number) => index % Math.ceil(xLabels.length / 6) === 0
                                    : isTablet
                                        ? (_value: unknown, index: number) => index % Math.ceil(xLabels.length / 10) === 0
                                        : (_value: unknown, index: number) => index % Math.ceil(xLabels.length / 18) === 0,
                            },
                        ]}
                        yAxis={[
                            {
                                width: isMobile ? 50 : 65,
                                tickLabelStyle: {
                                    fontSize: isMobile ? 10 : 12,
                                    fill: '#64748b',
                                },
                                valueFormatter: (v: number) =>
                                    v >= 1_000_000
                                        ? `${(v / 1_000_000).toFixed(1)}M`
                                        : v >= 1000
                                            ? `${(v / 1000).toFixed(0)}k`
                                            : String(v),
                            },
                        ]}
                        series={[
                            {
                                data: yValues,
                                label: 'Visits',
                                area: true,
                                showMark: viewMode !== 'daily' || yValues.length <= 60,
                                curve: 'monotoneX',
                                color: '#1976d2',
                            },
                        ]}
                        height={chartHeight}
                        margin={{
                            left: isMobile ? 10 : 16,
                            right: isMobile ? 12 : 24,
                            top: 16,
                            bottom: isMobile ? 36 : 44,
                        }}
                        grid={{ horizontal: true }}
                        sx={{
                            // Area gradient fill
                            '& .MuiAreaElement-root': {
                                fill: 'url(#areaGradient)',
                            },
                            '& .MuiLineElement-root': {
                                strokeWidth: 2.5,
                            },
                            '& .MuiMarkElement-root': {
                                strokeWidth: 2,
                                r: 3,
                                fill: 'white',
                                stroke: '#1976d2',
                            },
                            '& .MuiChartsGrid-line': {
                                stroke: '#e2e8f0',
                                strokeDasharray: '4 4',
                            },
                            '& .MuiChartsAxis-line': {
                                stroke: '#cbd5e1',
                            },
                            '& .MuiChartsAxis-tick': {
                                stroke: '#cbd5e1',
                            },
                            '& .MuiChartsLegend-root': {
                                display: 'none',
                            },
                        }}
                    >
                        {/* SVG gradient definition injected as child */}
                        <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1976d2" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#1976d2" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                    </LineChart>
                </Box>
            )}
        </CardContent>
    );
};

export default TrafficStatsChartContent;

