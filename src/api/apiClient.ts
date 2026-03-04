import axios from 'axios';
import {auth} from "../auth/firebase.ts";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    console.log("current user:", user);
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});