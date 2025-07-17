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
        const route = this.#routes.find(r => r.path === path);
        const authService = new AuthService(); 

        if (!route) {
            this.navigate('/');
            return;
        }

        if (route.protected && !authService.isAuthenticated()) {
            this.navigate('/login');
            return; 
        }

        const publicAuthRoutes = ['/login', '/register'];
        if (publicAuthRoutes.includes(path) && authService.isAuthenticated()) {
            this.navigate('/');
            return;
        }

        this.#outlet.innerHTML = '';
        route.view(this.#outlet);
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