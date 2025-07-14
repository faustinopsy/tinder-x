import { Card } from '../components/Card.js';

export class HomeView {
    #allProfiles = [];
    #currentIndex = 0;

    constructor(profiles) {
        this.#allProfiles = profiles;
    }

    render(outlet) {
        if (this.#allProfiles.length === 0) {
            outlet.innerHTML = `<p style="text-align: center; color: var(--text-secondary-color); padding: 20px;">Nenhum perfil encontrado.</p>`;
            return;
        }

        outlet.innerHTML = `
            <div class="card-deck"></div>
            <div class="actions">
                <button class="actions__button actions__button--dislike" data-action="dislike">...</button>
                <button class="actions__button actions__button--like" data-action="like">...</button>
            </div>
        `;

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
                     cardDeck.innerHTML = `<p>Você viu todos os perfis!</p>`;
                }
            }, 300);
        };
        
        outlet.querySelector('.actions').addEventListener('click', (event) => {
            const button = event.target.closest('[data-action]');
            if (button) handleDecision(button.dataset.action);
        });
        
        loadInitialCards();
    }
}