export class SideMenu {
    #menuElement;
    #overlayElement;

    constructor() {
        this.#menuElement = document.createElement('nav');
        this.#menuElement.className = 'side-menu';
        
        this.#overlayElement = document.createElement('div');
        this.#overlayElement.className = 'menu-overlay';

        this.#listenForClose();
    }

    render() {
        this.#menuElement.innerHTML = `
            <div class="side-menu__header">Menu</div>
            <ul class="side-menu__nav">
                <li><a href="/">Encontrar Perfis</a></li>
                <li><a href="/profile">Ajustes de Perfil</a></li>
                <li><a href="/settings">Configurações</a></li>
            </ul>
        `;
        return { menu: this.#menuElement, overlay: this.#overlayElement };
    }

    #listenForClose() {
        const close = () => this.close();
        this.#overlayElement.addEventListener('click', close);
        this.#menuElement.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                close();
            }
        });
    }

    open() {
        this.#menuElement.classList.add('side-menu--open');
        this.#overlayElement.classList.add('menu-overlay--visible');
    }

    close() {
        this.#menuElement.classList.remove('side-menu--open');
        this.#overlayElement.classList.remove('menu-overlay--visible');
    }
}