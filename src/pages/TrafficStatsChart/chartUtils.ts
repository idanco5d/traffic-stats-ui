// Utility functions for date formatting and data aggregation
export type ViewMode = 'daily' | 'weekly' | 'monthly';

export interface AggregatedPoint {
    label: string;
    visits: number;
}

export const getISOWeekLabel = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    // ISO week: Monday-based
    const dayOfWeek = (d.getDay() + 6) % 7; // 0=Mon
    const monday = new Date(d);
    monday.setDate(d.getDate() - dayOfWeek);
    return `${monday.getFullYear()}-W${String(getISOWeek(monday)).padStart(2, '0')}`;
};

export const getISOWeek = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export const getMonthLabel = (dateStr: string): string => {
    const [year, month] = dateStr.split('-');
    return `${year}-${month}`;
};

export const formatMonthLabel = (label: string): string => {
    const [year, month] = label.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const formatWeekLabel = (label: string): string => {
    const [yearStr, weekPart] = label.split('-W');
    const week = parseInt(weekPart, 10);
    const year = parseInt(yearStr, 10);
    const jan4 = new Date(year, 0, 4);
    const startOfWeek = new Date(jan4);
    startOfWeek.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (week - 1) * 7);
    return startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatDayLabel = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const aggregateData = (data: Array<{ date: string; visits: number }> | undefined, viewMode: ViewMode): AggregatedPoint[] => {
    const raw = data ?? [];
    if (viewMode === 'daily') {
        return [...raw]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((entry) => ({ label: entry.date, visits: entry.visits }));
    }

    const map = new Map<string, number>();
    for (const entry of raw) {
        const key = viewMode === 'weekly' ? getISOWeekLabel(entry.date) : getMonthLabel(entry.date);
        map.set(key, (map.get(key) ?? 0) + entry.visits);
    }
    return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, visits]) => ({ label, visits }));
};

