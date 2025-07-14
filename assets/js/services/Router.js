export class Router {
    #routes = [];
    #outlet;

    constructor(routes, outletElement) {
        this.#routes = routes;
        this.#outlet = outletElement;
        this.#listen();
        this.#resolve();
    }

    #listen() {
        window.addEventListener('popstate', () => this.#resolve());
        document.body.addEventListener('click', e => {
            const link = e.target.closest('a');
            if (!link || !link.hasAttribute('href')) return;
            
            const href = link.getAttribute('href');
            if (href.startsWith('http') || link.getAttribute('target') === '_blank') return;

            e.preventDefault();
            this.navigate(href);
        });
    }

    navigate(path) {
        if (window.location.pathname === path) return;
        history.pushState({}, '', path);
        this.#resolve();
    }
    
    #resolve() {
        const path = window.location.pathname;
        const route = this.#routes.find(r => r.path === path);
        
        this.#updateActiveLinks(path);

        this.#outlet.innerHTML = '';
        if (route) {
            route.view(this.#outlet);
        } else {
            this.navigate('/');
        }
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