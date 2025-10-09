import axios from 'axios';

const API_BASE_URL = 'https://localhost:7001/api';

export const orderService = {
    // Criar nova ordem
    async createOrder(orderData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
            return response.data;
        } catch (error) {
            if (error.response) {
                const message = error.response.data?.message ||
                    error.response.data?.Title ||
                    'Erro ao criar ordem';
                throw new Error(message);
            } else if (error.request) {
                throw new Error('Erro de conexão com a API');
            } else {
                throw new Error('Erro inesperado');
            }
        }
    },

    // Buscar exposições
    //async getExposures() {
    //    try {
    //        const response = await axios.get(`${API_BASE_URL}/exposure`);
    //        return response.data;
    //    } catch (error) {
    //        if (error.response) {
    //            const message = error.response.data?.message ||
    //                error.response.data?.Title ||
    //                'Erro ao buscar exposições';
    //            throw new Error(message);
    //        } else if (error.request) {
    //            throw new Error('Erro de conexão com a API');
    //        } else {
    //            throw new Error('Erro inesperado');
    //        }
    //    }
    //}
};