import { AuthService } from './AuthService.js';
export class Router {
    #routes = [];
    #outlet;
    constructor(routes, outletElement) {
        this.#routes = routes;
        this.#outlet = outletElement;
        window.addEventListener('popstate', () => this.#resolve());
        document.body.addEventListener('click', e => {
            const link = e.target.closest('a');
            if (!link || !link.hasAttribute('href')) return;
            const href = link.getAttribute('href');
            if (href.startsWith('http') || link.getAttribute('target') === '_blank') return;
            e.preventDefault();
            this.navigate(href);
        });
        this.#resolve();
    }
    navigate(path) {
        if (window.location.pathname === path) return;
        history.pushState({}, '', path);
        this.#resolve();
    }
    #resolve() {
        const path = window.location.pathname;
        const authService = new AuthService();

        let targetRoute = null;
        let params = {};
        
        for (const route of this.#routes) {
            const routePath = route.path.replace(/\{([a-zA-Z0-9_]+)\}/g, '(?<$1>[^/]+)');
            const regex = new RegExp(`^${routePath}$`);
            const match = path.match(regex);
            if (match) {
                targetRoute = route;
                params = match.groups || {};
                break;
            }
        }

        if (!targetRoute) {
            this.navigate(authService.isAuthenticated() ? '/' : '/login');
            return;
        }

        if (targetRoute.protected && !authService.isAuthenticated()) {
            this.navigate('/login');
            return; 
        }

        this.#outlet.innerHTML = '';
        targetRoute.view(this.#outlet, params);
        this.#updateActiveLinks(path);
    }
    #updateActiveLinks(currentPath) {
        document.querySelectorAll('.side-menu__nav a, .bottom-menu__item').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }
}