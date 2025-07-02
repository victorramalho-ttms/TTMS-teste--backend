import { CardService } from '../../services/cardServiceClass.js';

describe('CardService', () => {
    it('tem q lançar erro se a api falhar', async () => {
        const cardService = new CardService();
        cardService.axiosInstance = { get: async () => { throw new Error('api error'); } };
        await expect(cardService.generateVisaCards(1)).rejects.toThrow('api falhou');
    });
});
