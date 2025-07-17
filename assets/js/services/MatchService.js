import { AuthService } from './AuthService.js';

export class MatchService {
    #apiUrl;
    #authService;

    constructor() {
        this.#authService = new AuthService();
        this.#apiUrl = this.#authService.apiUrl;
    }

    async getMyMatches() {
        const endpoint = `${this.#apiUrl}/matches`;
        try {
            const response = await fetch(endpoint, {
                headers: this.#authService.getAuthHeaders()
            });
            if (!response.ok) throw new Error('Falha ao buscar matches.');
            return await response.json();
        } catch (error) {
            console.error("Erro em getMyMatches:", error);
            return [];
        }
    }

    async getMessages(matchId) {
        const endpoint = `${this.#apiUrl}/matches/${matchId}/messages`;
        try {
            const response = await fetch(endpoint, { headers: this.#authService.getAuthHeaders() });
            if (!response.ok) throw new Error('Falha ao buscar mensagens.');
            return await response.json();
        } catch (error) {
            console.error("Erro em getMessages:", error);
            return [];
        }
    }

    async sendMessage(matchId, content) {
        const endpoint = `${this.#apiUrl}/matches/${matchId}/messages`;
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.#authService.getAuthHeaders()
                },
                body: JSON.stringify({ content })
            });
            if (!response.ok) throw new Error('Falha ao enviar mensagem.');
            return await response.json();
        } catch (error) {
            console.error("Erro em sendMessage:", error);
            return { success: false };
        }
    }

    async sendSwipe(swipedUserId, action) {
        const endpoint = `${this.#apiUrl}/swipes`;
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.#authService.getAuthHeaders()
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