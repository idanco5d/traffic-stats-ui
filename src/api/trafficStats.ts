import {apiClient} from "./apiClient.ts";

export async function fetchStats(offset: number): Promise<TrafficPage> {
    const response = await apiClient.get('', {params: {offset}});
    return response.data;
}

export interface TrafficStat {
    date: string;   // YYYY-MM-DD
    visits: number;
    id?: number;
}

export interface TrafficPage {
    data: TrafficStat[];
    page: number;
    totalPages: number;
    totalEntries: number;
}