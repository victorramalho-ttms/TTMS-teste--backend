import axiosInstance from '../utils/axiosInstance.js';

export class CardService {
    async fetchVisaCards(quantity = 100) {
        const cards = [];
        for (let i = 0; i < quantity; i++) {
            const response = await axiosInstance.get('/Card', { params: { type: 'Visa' } });
            cards.push(response.data);
        }
        return cards;
    }
}