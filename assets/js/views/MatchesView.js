import { MatchService } from '../services/MatchService.js';

export class MatchesView {
    #matchService;

    constructor() {
        this.#matchService = new MatchService();
    }

    async render(outlet) {
        outlet.innerHTML = `<div class="matches-container"><h2>Carregando seus matches...</h2></div>`;

        const matches = await this.#matchService.getMyMatches();

        if (matches.length === 0) {
            outlet.innerHTML = `<div class="matches-container"><h2>Nenhum match encontrado ainda.</h2><p>Continue deslizando!</p></div>`;
            return;
        }

        const matchesHtml = matches.map(match => `
            <a href="/chat/${match.match_id}" class="match-item">
                <img src="${match.photo_url || 'https://i.pravatar.cc/500?img=0'}" alt="${match.name}" class="match-photo">
                <p class="match-name">${match.name}</p>
            </a>
        `).join('');

        outlet.innerHTML = `
            <div class="matches-container">
                <h2>Seus Matches</h2>
                <div class="matches-list">
                    ${matchesHtml}
                </div>
            </div>
        `;
    }
}