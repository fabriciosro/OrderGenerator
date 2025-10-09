import axios from 'axios';

const API_BASE_URL = 'https://localhost:5000/api';

axios.defaults.timeout = 30000;

export const orderService = {
    async createOrder(orderData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/Orders`, orderData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Erro no servidor');
            } else if (error.request) {
                throw new Error('Sem resposta do servidor. Verifique se o OrderAccumulator está executando.');
            } else {
                throw new Error('Erro ao processar requisição');
            }
        }
    },

    async getExposures() {
        try {
            const response = await axios.get(`${API_BASE_URL}/exposure`);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar exposições');
        }
    }
};