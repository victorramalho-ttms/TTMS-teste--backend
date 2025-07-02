import axiosInstance from '../utils/axiosInstance.js';

export class CardService {
    async generateVisaCards(quantity = 100) {
        const cardsList = [];
        for (let i = 0; i < quantity; i++) {
            try {
                const response = await axiosInstance.get('/Card', {
                    params: { type: 'Visa' }
                });
                cardsList.push({ cardNumber: response.data });
            } catch (error) {
                throw new Error('api falhou, nao foi possivel obter numero do cartao', error);
            }
        }
        return cardsList;
    }
}
