import {apiClient} from "./apiClient.ts";

export async function fetchStats(): Promise<TrafficStat[]> {
    const response = await apiClient.get('');
    return response.data;
}

export async function addStat(trafficStat: TrafficStat): Promise<TrafficStat> {
    const response = await apiClient.post('', trafficStat);
    return response.data;
}

export async function updateStat(id: string, trafficStat: TrafficStat): Promise<TrafficStat> {
    const response = await apiClient.put(``, trafficStat, {params: {id: id}});
    return response.data;
}

export async function deleteStat(id: string): Promise<void> {
    await apiClient.delete(``, {params: {id: id}});
}

export interface TrafficStat {
    date: string;   // YYYY-MM-DD
    visits: number;
    id?: string;
}
