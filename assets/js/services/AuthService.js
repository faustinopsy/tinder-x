export class AuthService {
    apiUrl = 'http://localhost:8080';

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha no login.');
            }

            if (data.token) {
                this.saveToken(data.token);
                return { success: true };
            }
            return { success: false, error: 'Token não recebido.' };
        } catch (error) {
            console.error('Erro de login:', error);
            return { success: false, error: error.message };
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${this.apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao registrar.');
            }

            return { success: true, data };
        } catch (error) {
            console.error('Erro de registro:', error);
            return { success: false, error: error.message };
        }
    }

    saveToken(token) {
        localStorage.setItem('authToken', token);
    }

    getToken() {
        return localStorage.getItem('authToken');
    }

    logout() {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    }

    getAuthHeaders() {
        const token = this.getToken();
        if (!token) return {};
        
        return {
            'Authorization': `Bearer ${token}`
        };
    }

    isAuthenticated() {
        const token = this.getToken();
        return token !== null && token !== undefined;
    }
}