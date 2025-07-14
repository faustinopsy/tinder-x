export class SettingsView {
    #settingsService;

    constructor(settingsService) {
        this.#settingsService = settingsService;
    }

    render(outlet) {
        const currentTheme = this.#settingsService.get('theme');
        const currentMenuStyle = this.#settingsService.get('menuStyle');
        outlet.innerHTML = `
            <div class="settings-page">
                <h2>Configurações</h2>
                 <div class="settings-group">
                <div class="settings-group__title">Posição do Menu:</div>
                <div class="settings-options">
                    <div class="settings-option ${currentMenuStyle === 'side' ? 'active' : ''}" data-key="menuStyle" data-value="side">
                        <div class="settings-option__icon">⬅️</div>
                        <div class="settings-option__label">Lateral</div>
                    </div>
                    <div class="settings-option ${currentMenuStyle === 'bottom' ? 'active' : ''}" data-key="menuStyle" data-value="bottom">
                         <div class="settings-option__icon">⬇️</div>
                        <div class="settings-option__label">Inferior</div>
                    </div>
                </div>
            </div>

            <div class="settings-group">
                <div class="settings-group__title">Cores do tema:</div>
                <div class="settings-options">
                    <div class="settings-option ${currentTheme === 'dark-yellow' ? 'active' : ''}" data-key="theme" data-value="dark-yellow">
                        <div class="color-preview"></div>
                        <div class="settings-option__label">Amarelo e Preto</div>
                    </div>
                    <div class="settings-option ${currentTheme === 'light' ? 'active' : ''}" data-key="theme" data-value="light">
                        <div class="color-preview"></div>
                        <div class="settings-option__label">Padrão Claro</div>
                    </div>
                </div>
            </div>
            </div>`;

        this.#addEventListeners(outlet);
    }

    #addEventListeners(outlet) {
        outlet.querySelectorAll('.settings-option').forEach(option => {
            option.addEventListener('click', () => {
                const key = option.dataset.key;
                const value = option.dataset.value;
                this.#settingsService.save(key, value);
                outlet.querySelectorAll(`.settings-option[data-key="${key}"]`).forEach(el => el.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }
}