import { AuthService } from '../services/AuthService.js';

export class LoginView {
    #authService;

    constructor() {
        this.#authService = new AuthService();
    }

    render(outlet) {
        outlet.innerHTML = `
            <div class="form-container">
                <h2>Login</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Senha</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div id="error-message" class="error-message"></div>
                    <button type="submit" class="form-button">Entrar</button>
                    <p class="form-switch">Não tem uma conta? <a href="/register">Cadastre-se</a></p>
                </form>
            </div>
        `;
        this.#addEventListeners();
    }

    #addEventListeners() {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.email.value;
            const password = form.password.value;
            const errorDiv = document.getElementById('error-message');

            const result = await this.#authService.login(email, password);

            if (result.success) {
                window.location.href = '/';
            } else {
                errorDiv.textContent = result.error || 'Ocorreu um erro.';
            }
        });
    }
}