import { Router } from '../services/Router.js';
import { Header } from './Header.js';
import { SideMenu } from './SideMenu.js';
import { BottomMenu } from './BottomMenu.js';
import { HomeView } from '../views/HomeView.js';
import { ProfileView } from '../views/ProfileView.js';
import { SettingsView } from '../views/SettingsView.js';

export class App {
    #profileService;
    #settingsService;
    #seenService;
    #appElement;
    #mainContentElement;
    #router;

    constructor(appElement, profileService, seenService, settingsService) {
        this.#appElement = appElement;
        this.#profileService = profileService;
        this.#seenService = seenService;
        this.#settingsService = settingsService;
    }

    async init() {
        this.#settingsService.init();
        await this.#profileService.fetchInitialProfiles();
        
        this.#renderLayout();
        this.#setupRouter();

        document.addEventListener('setting-changed', (e) => {
            if (e.detail.key === 'menuStyle') {
                this.#renderLayout();
                this.#setupRouter();
            }
        });
    }

    #setupRouter() {
        const routes = [
            { path: '/', view: (outlet) => new HomeView(this.#profileService, this.#seenService).render(outlet) },
            { path: '/profile', view: (outlet) => new ProfileView(this.#settingsService).render(outlet) },
            { path: '/settings', view: (outlet) => new SettingsView(this.#settingsService).render(outlet) },
            { path: '/matches', view: (outlet) => { outlet.innerHTML = '<h2>Matches (em construção)</h2>' } },
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
            const sideMenu = new SideMenu();
            const { menu: menuElement, overlay: overlayElement } = sideMenu.render();
            document.addEventListener('toggleMenu', () => sideMenu.open());
            this.#appElement.append(header.render(), this.#mainContentElement, menuElement, overlayElement);
        } else {
            const bottomMenu = new BottomMenu();
            this.#appElement.append(this.#mainContentElement, bottomMenu.render());
        }
    }
}