import axios from 'axios';
import type {
    Configuration,
    UpdateConfigDto,
    CalculateBillDto,
    BillResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const configApi = {
    // Get active configuration (public)
    getActiveConfig: async (): Promise<Configuration> => {
        const response = await apiClient.get<Configuration>('/api/config');
        return response.data;
    },

    // Update configuration (admin only)
    updateConfig: async (
        data: UpdateConfigDto,
        adminPin: string
    ): Promise<Configuration> => {
        const response = await apiClient.put<Configuration>(
            '/api/admin/config',
            data,
            {
                headers: {
                    'x-admin-pin': adminPin,
                },
            }
        );
        return response.data;
    },

    // Get configuration history (admin only)
    getConfigHistory: async (adminPin: string): Promise<Configuration[]> => {
        const response = await apiClient.get<Configuration[]>(
            '/api/admin/config/history',
            {
                headers: {
                    'x-admin-pin': adminPin,
                },
            }
        );
        return response.data;
    },
};

export const billApi = {
    // Calculate bill (public)
    calculateBill: async (data: CalculateBillDto): Promise<BillResponse> => {
        const response = await apiClient.post<BillResponse>(
            '/api/calculate',
            data
        );
        return response.data;
    },
};
