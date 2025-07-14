export class Header {
    render() {
        const headerElement = document.createElement('header');
        headerElement.className = 'header';
        headerElement.innerHTML = `
            <button class="header__menu-button" aria-label="Abrir menu">
                <svg viewBox="0 0 24 24">
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
            </button>
            <h1 class="header__title">devMatch</h1>
        `;

        headerElement.querySelector('.header__menu-button').addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('toggleMenu'));
        });

        return headerElement;
    }
}