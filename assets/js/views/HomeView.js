import { Card } from '../components/Card.js';

export class HomeView {
    #allProfiles = [];
    #currentIndex = 0;
    #profileService;
    #seenService;

    constructor(profileService, seenService) {
        this.#profileService = profileService;
        this.#seenService = seenService;
        this.#allProfiles = profileService.getProfiles();
    }

    render(outlet) {
        if (this.#allProfiles.length === 0) {
            outlet.innerHTML = `<p style="text-align: center; color: var(--text-secondary-color); padding: 20px;">Nenhum perfil encontrado. Verifique o console.</p>`;
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

            const swipedProfile = this.#allProfiles[this.#currentIndex];
            
            if (swipedProfile) {
                this.#seenService.add(swipedProfile.id);
            }

            const animationClass = action === 'like' ? 'card--dismiss-right' : 'card--dismiss-left';
            currentCardElement.classList.add(animationClass);

            setTimeout(() => {
                currentCardElement.remove();
                this.#currentIndex++;
                
                if (this.#allProfiles.length - this.#currentIndex < 5) {
                    this.#profileService.fetchMoreProfiles();
                }
                
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