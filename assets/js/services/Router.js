export class Router {
    #routes = [];
    #outlet;

    constructor(routes, outletElement) {
        this.#routes = routes;
        this.#outlet = outletElement;
        this.#listen();
    }

    #listen() {
        window.addEventListener('popstate', () => this.#resolve());

        document.addEventListener('DOMContentLoaded', () => this.#resolve());

        document.body.addEventListener('click', e => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || link.getAttribute('target') === '_blank') {
                return;
            }

            e.preventDefault();
            this.navigate(href);
        });
    }

    navigate(path) {
        history.pushState({}, '', path);
        this.#resolve();
    }

    #resolve() {
        const path = window.location.pathname;
        const route = this.#routes.find(r => r.path === path);
        
        this.#outlet.innerHTML = '';

        if (route) {
            route.view(this.#outlet);
        } else {
            const homeRoute = this.#routes.find(r => r.path === '/');
            if (homeRoute) {
                this.navigate('/');
            } else {
                this.#outlet.innerHTML = '<h2>404 - Página Não Encontrada</h2>';
            }
        }
    }
}