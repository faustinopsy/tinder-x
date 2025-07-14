import { Card } from './Card.js';
import { Router } from '../services/Router.js';
import { Header } from './Header.js';
import { SideMenu } from './SideMenu.js';
import { SettingsService } from '../services/SettingsService.js';
import { BottomMenu } from './BottomMenu.js';

export class App {
    #profileService;
    #allProfiles = [];
    #currentIndex = 0;
    
    #appElement;
    #mainContentElement;
    #sideMenu;
    #settingsService;
    #router;

    constructor(appElement, profileService) {
        this.#appElement = appElement;
        this.#profileService = profileService;
        this.#settingsService = new SettingsService();
    }

    async init() {
        this.#settingsService.init();
        this.#allProfiles = await this.#profileService.fetchProfiles();
        
        this.#renderLayout();
        
        this.#setupRouter();

        document.addEventListener('setting-changed', (e) => {
            if (e.detail.key === 'menuStyle') {
                this.#renderLayout();
                this.#setupRouter(); 
                this.#router.navigate(window.location.pathname);
            }
        });
    }

    #setupRouter() {
        const routes = [
            { path: '/', view: (outlet) => this.#renderHomeView(outlet) },
            { path: '/profile', view: (outlet) => this.#renderGenericView(outlet, 'Ajustes de Perfil') },
            { path: '/matches', view: (outlet) => this.#renderGenericView(outlet, 'Matches') },
            { path: '/settings', view: (outlet) => this.#renderSettingsView(outlet) },
        ];
        
        this.#router = new Router(routes, this.#mainContentElement);
    }

    #renderLayout() {
        const menuStyle = this.#settingsService.get('menuStyle');
        this.#appElement.className = 'app';
        this.#appElement.innerHTML = '';

        if (menuStyle === 'bottom') {
            this.#appElement.classList.add('app--has-bottom-menu');
        }

        this.#mainContentElement = document.createElement('main');
        this.#mainContentElement.className = 'main-content';

        if (menuStyle === 'side') {
            const header = new Header();
            this.#sideMenu = new SideMenu();
            const { menu: menuElement, overlay: overlayElement } = this.#sideMenu.render();
            
            document.addEventListener('toggleMenu', () => this.#sideMenu.open());

            this.#appElement.append(header.render(), this.#mainContentElement, menuElement, overlayElement);
        } else { 
            const bottomMenu = new BottomMenu();
            this.#appElement.append(this.#mainContentElement, bottomMenu.render());
        }
    }

    #renderHomeView(outlet) {
        if (this.#allProfiles.length === 0) {
            outlet.innerHTML = `<p style="text-align: center; color: var(--text-secondary-color); padding: 20px;">Nenhum perfil encontrado.</p>`;
            return;
        }

        outlet.innerHTML = `
            <div class="card-deck"></div>
            <div class="actions">
                <button class="actions__button actions__button--dislike" data-action="dislike">
                    <svg viewBox="0 0 24 24"><path d="M12 4.419c-2.826-5.2-11.979-3.272-11.979 3.272 0 7.272 9.979 11.271 11.979 13.029 2-1.758 11.979-5.757 11.979-13.029 0-6.544-9.153-8.472-11.979-3.272z" transform="rotate(45 12 12) scale(0.6) translate(10 10)"/></svg>
                </button>
                <button class="actions__button actions__button--like" data-action="like">
                    <svg viewBox="0 0 24 24"><path d="M12 4.419c-2.826-5.2-11.979-3.272-11.979 3.272 0 7.272 9.979 11.271 11.979 13.029 2-1.758 11.979-5.757 11.979-13.029 0-6.544-9.153-8.472-11.979-3.272z" transform="scale(0.6) translate(4 4)"/></svg>
                </button>
            </div>
        `;

        this.#currentIndex = 0; 
        const cardDeck = outlet.querySelector('.card-deck');
        
        const loadInitialCards = () => {
             const batchSize = Math.min(5, this.#allProfiles.length);
             for (let i = batchSize - 1; i >= 0; i--) {
                const cardComponent = new Card(this.#allProfiles[i]);
                cardDeck.appendChild(cardComponent.render());
             }
        };

        const handleDecision = (action) => {
            const currentCardElement = cardDeck.lastChild;
            if (!currentCardElement) return;

            console.log(`Action: ${action} on profile ${this.#allProfiles[this.#currentIndex].name}`);

            const animationClass = action === 'like' ? 'card--dismiss-right' : 'card--dismiss-left';
            currentCardElement.classList.add(animationClass);

            setTimeout(() => {
                currentCardElement.remove();
                
                this.#currentIndex++;
                
                const nextProfileIndex = this.#currentIndex + 4;
                if (nextProfileIndex < this.#allProfiles.length) {
                    const cardComponent = new Card(this.#allProfiles[nextProfileIndex]);
                    cardDeck.insertBefore(cardComponent.render(), cardDeck.firstChild);
                }

                if (cardDeck.children.length === 0) {
                     outlet.querySelector('.actions').style.display = 'none';
                     cardDeck.innerHTML = `<p style="text-align: center; color: var(--text-secondary-color);">Você viu todos os perfis!</p>`;
                }
            }, 300); 
        };
        
        outlet.querySelector('.actions').addEventListener('click', (event) => {
            const button = event.target.closest('[data-action]');
            if (button) handleDecision(button.dataset.action);
        });
        
        loadInitialCards();
    }

    #renderSettingsView(outlet) {
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
                <div class.settings-group__title">Cores do tema:</div>
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
        </div>
        `;

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

    #renderGenericView(outlet, title) {
        outlet.innerHTML = `<div style="padding: 20px;"><h2 style="color: var(--primary-color); text-align: center;">${title}</h2><p style="text-align: center; margin-top: 20px; color: var(--text-secondary-color);">Página em construção.</p></div>`;
    }
}