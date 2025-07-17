import { MatchService } from '../services/MatchService.js';
import { AuthService } from '../services/AuthService.js';

export class ChatView {
    #matchId;
    #matchService;
    #authService;
    #outlet;
    #eventSource;
    #currentUserId;

    constructor(matchId) {
        this.#matchId = matchId;
        this.#matchService = new MatchService();
        this.#authService = new AuthService();
        
        const token = this.#authService.getToken();
        this.#currentUserId = token ? JSON.parse(atob(token.split('.')[1])).sub : null;
    }

    async render(outlet) {
        this.#outlet = outlet;
        this.#outlet.innerHTML = `
            <div class="chat-container">
                <header class="chat-header">
                    <a href="/matches" class="back-button">←</a>
                    <img src="https://i.pravatar.cc/150" class="chat-avatar skeleton">
                    <h2 class="chat-title">Carregando...</h2>
                </header>
                <div class="chat-messages"></div>
                <form class="chat-form">
                    <input type="text" class="chat-input" placeholder="Digite sua mensagem..." autocomplete="off">
                    <button type="submit" class="send-button">Enviar</button>
                </form>
            </div>
        `;

        this.#addEventListeners();
        await this.#loadChatData();
        this.#connectToStream();
    }
    
    async #loadChatData() {
        const messages = await this.#matchService.getMessages(this.#matchId);
        const matches = await this.#matchService.getMyMatches();
        const currentMatch = matches.find(m => m.match_id == this.#matchId);

        if (currentMatch) {
            this.#updateHeader(currentMatch);
        }

        messages.forEach(msg => this.#appendMessage(msg));
    }

    #updateHeader(matchData) {
        const title = this.#outlet.querySelector('.chat-title');
        const avatar = this.#outlet.querySelector('.chat-avatar');
        title.textContent = matchData.name;
        avatar.src = matchData.photo_url || 'https://i.pravatar.cc/500?img=0';
        avatar.classList.remove('skeleton');
    }

    #connectToStream() {
        if (this.#eventSource) {
            this.#eventSource.close();
        }

        const endpoint = `${this.#authService.apiUrl}/messagesstream/${this.#matchId}`;
        this.#eventSource = new EventSource(endpoint, { withCredentials: true });

        this.#eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.sender_id != this.#currentUserId) {
                this.#appendMessage(message);
            }
        };

        this.#eventSource.onerror = () => {
            console.error("Conexão SSE perdida.");
            this.#eventSource.close();
        };
    }

    #appendMessage(msg) {
        const messagesContainer = this.#outlet.querySelector('.chat-messages');
        const isSentByMe = msg.sender_id == this.#currentUserId;
        const bubbleClass = isSentByMe ? 'sent' : 'received';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-bubble ${bubbleClass}`;
        messageDiv.textContent = msg.content;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    #addEventListeners() {
        const form = this.#outlet.querySelector('.chat-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = this.#outlet.querySelector('.chat-input');
            const content = input.value.trim();

            if (content) {
                const tempMessage = { sender_id: this.#currentUserId, content: content };
                this.#appendMessage(tempMessage);
                
                input.value = '';
                const result = await this.#matchService.sendMessage(this.#matchId, content);
                
                if (!result.success) {
                    alert('Não foi possível enviar a mensagem.');
                }
            }
        });

        const backButton = this.#outlet.querySelector('.back-button');
        backButton.addEventListener('click', () => {
            if (this.#eventSource) {
                this.#eventSource.close();
            }
        });
    }
}