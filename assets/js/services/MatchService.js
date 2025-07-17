import { AuthService } from './AuthService.js';

export class MatchService {
    authService = new AuthService();
    #apiUrl = this.authService.apiUrl;
    

    async getMyMatches() {
        const endpoint = `${this.#apiUrl}/matches`;
        try {
            const response = await fetch(endpoint, {
                headers: this.authService.getAuthHeaders()
            });
            if (!response.ok) throw new Error('Falha ao buscar matches.');
            return await response.json();
        } catch (error) {
            console.error("Erro em getMyMatches:", error);
            return [];
        }
    }

    async sendSwipe(swipedUserId, action) {
        const endpoint = `${this.#apiUrl}/swipes`;
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.authService.getAuthHeaders()
                },
                body: JSON.stringify({
                    swiped_id: swipedUserId,
                    action: action
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao registrar o swipe.');
            }

            return await response.json(); 

        } catch (error) {
            console.error("Erro em sendSwipe:", error);
            return { success: false, match: false, error: error.message };
        }
    }
}