import { AuthService } from '../services/AuthService.js';
import { SettingsService } from '../services/SettingsService.js';

export class RegisterView {
    #authService;
    #settingsService;

    constructor() {
        this.#authService = new AuthService();
        this.#settingsService = new SettingsService(); 
        this.#settingsService.init(); 
    }

    render(outlet) {
        const defaultGender = this.#settingsService.get('userGender');
        const defaultInterest = this.#settingsService.get('userInterest');

        outlet.innerHTML = `
            <div class="form-container">
                <h2>Crie sua Conta</h2>
                <form id="register-form">
                    <div class="form-group">
                        <label for="name">Nome</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Senha</label>
                        <input type="password" id="password" name="password" required>
                    </div>

                    <div class="settings-group">
                        <div class="settings-group__title">Meu Gênero:</div>
                        <div class="settings-options">
                            <div class="settings-option ${defaultGender === 'male' ? 'active' : ''}" data-key="userGender" data-value="male">
                                <div class="settings-option__icon"><svg viewBox="0 0 24 24"><path d="M19 5h-4V2h-2v3h-4.5A4.5 4.5 0 006 9.5V14h3v8h2v-8h3V9.5A4.5 4.5 0 0013.5 5H15V2h2v3h2v2z"/></svg></div>
                                <div class="settings-option__label">Homem</div>
                            </div>
                            <div class="settings-option ${defaultGender === 'female' ? 'active' : ''}" data-key="userGender" data-value="female">
                                 <div class="settings-option__icon"><svg viewBox="0 0 24 24"><path d="M12 9a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
                                <div class="settings-option__label">Mulher</div>
                            </div>
                            <div class="settings-option ${defaultGender === 'non-binary' ? 'active' : ''}" data-key="userGender" data-value="non-binary">
                                 <div class="settings-option__icon"><svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 00-5 5c0 2.34 1.61 4.29 3.78 4.85-1.99 1.4-3.28 3.7-3.28 6.15H10v-2h4v2h2.5c0-2.45-1.29-4.75-3.28-6.15A4.93 4.93 0 0017 7a5 5 0 00-5-5z"/></svg></div>
                                <div class="settings-option__label">Outro</div>
                            </div>
                        </div>
                    </div>

                    <div class="settings-group">
                        <div class="settings-group__title">Tenho Interesse Em:</div>
                        <div class="settings-options">
                            <div class="settings-option ${defaultInterest === 'male' ? 'active' : ''}" data-key="userInterest" data-value="male">
                                <div class="settings-option__icon"><svg viewBox="0 0 24 24"><path d="M19 5h-4V2h-2v3h-4.5A4.5 4.5 0 006 9.5V14h3v8h2v-8h3V9.5A4.5 4.5 0 0013.5 5H15V2h2v3h2v2z"/></svg></div>
                                <div class="settings-option__label">Homens</div>
                            </div>
                            <div class="settings-option ${defaultInterest === 'female' ? 'active' : ''}" data-key="userInterest" data-value="female">
                                <div class="settings-option__icon"><svg viewBox="0 0 24 24"><path d="M12 9a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
                                <div class="settings-option__label">Mulheres</div>
                            </div>
                             <div class="settings-option ${defaultInterest === 'all' ? 'active' : ''}" data-key="userInterest" data-value="all">
                                <div class="settings-option__icon"><svg viewBox="0 0 24 24"><path d="M16.5 6A4.5 4.5 0 0013 9.35V14h1.5v8h2v-8H18V9.5A4.5 4.5 0 0016.5 5m-11 0A4.5 4.5 0 001 9.5V14h1.5v8h2v-8H6V9.5A4.5 4.5 0 005.5 5z"/></svg></div>
                                <div class="settings-option__label">Todos</div>
                            </div>
                        </div>
                    </div>

                    <div id="error-message" class="error-message"></div>
                    <button type="submit" class="form-button">Cadastrar</button>
                    <p class="form-switch">Já tem uma conta? <a href="/login">Faça login</a></p>
                </form>
            </div>
        `;
        this.#addEventListeners();
    }

    #addEventListeners() {
        const form = document.getElementById('register-form');
        
        form.querySelectorAll('.settings-option').forEach(option => {
            option.addEventListener('click', () => {
                const key = option.dataset.key;
                form.querySelectorAll(`.settings-option[data-key="${key}"]`).forEach(el => el.classList.remove('active'));
                option.classList.add('active');
            });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorDiv = document.getElementById('error-message');
            
            const userData = {
                name: form.name.value,
                email: form.email.value,
                password: form.password.value,
                gender: form.querySelector('.settings-option[data-key="userGender"].active')?.dataset.value,
                interest: form.querySelector('.settings-option[data-key="userInterest"].active')?.dataset.value,
            };

            const result = await this.#authService.register(userData);

            if (result.success) {
                alert('Cadastro realizado com sucesso! Por favor, faça o login.');
                window.location.href = '/login';
            } else {
                errorDiv.textContent = result.error || 'Ocorreu um erro.';
            }
        });
    }
}