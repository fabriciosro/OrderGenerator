import axios from 'axios';

const API_BASE_URL = '/api';

// Configure axios defaults
axios.defaults.timeout = 30000;

export const orderService = {
    async createOrder(orderData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Erro no servidor');
            } else if (error.request) {
                throw new Error('Sem resposta do servidor. Verifique a conexão.');
            } else {
                throw new Error('Erro ao processar requisição');
            }
        }
    }
};