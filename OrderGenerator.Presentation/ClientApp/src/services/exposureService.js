import axios from 'axios';

const API_BASE_URL = 'https://localhost:7001/api';

export const exposureService = {
    // Buscar exposições
    async getExposures() {
        try {
            const response = await axios.get(`${API_BASE_URL}/exposures`);
            return response.data;
        } catch (error) {
            if (error.response) {
                const message = error.response.data?.message ||
                    error.response.data?.Title ||
                    'Erro ao buscar exposições';
                throw new Error(message);
            } else if (error.request) {
                throw new Error('Erro de conexão com a API');
            } else {
                throw new Error('Erro inesperado');
            }
        }
    },

    // Reset exposições
    async resetAccumulator() {
        try {
            console.log('SERVICE: Resetando accumulator...');
            const response = await axios.post(`${API_BASE_URL}/reset`);
            console.log('SERVICE: Reset response:', response.data);
            return response.data;
        } catch (error) {
            console.log('SERVICE: Erro no reset:', error);
            if (error.response) {
                const message = error.response.data?.message ||
                    error.response.data?.error ||
                    'Erro ao resetar';
                throw new Error(message);
            } else if (error.request) {
                throw new Error('Erro de conexao com a API');
            } else {
                throw new Error('Erro inesperado');
            }
        }
    }
};