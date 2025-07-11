import axiosInstance from '../utils/axiosInstance.js';
import { CardDomain } from '../domain/domain.js';

export class CardService {
    async generateVisaCards(quantity = 100) {
        const cardDomain = new CardDomain();
        return cardDomain.mountVisaCardsList(
            () => axiosInstance.get('/Card', { params: { type: 'Visa' } }),
            quantity
        );
    }
}