import { AuthService } from './AuthService.js';
export class ProfileService {
    #allProfiles = [];
    #apiUrl = 'http://localhost:8080';
    #seenService;

    constructor(seenService) {
        this.#seenService = seenService;
    }

    getProfiles() {
        return this.#allProfiles;
    }

    async fetchInitialProfiles() {
        if (this.#allProfiles.length > 0) return this.#allProfiles;
        await this.fetchMoreProfiles();
        return this.#allProfiles;
    }

    async fetchMoreProfiles() {
        const endpoint = `${this.#apiUrl}/deck`;
        const authService = new AuthService();

        console.log(`Buscando perfis do backend: ${endpoint}`);
        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...authService.getAuthHeaders()
                }
            });
            if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
            const profilesFromApi = await response.json();
            
            const newProfiles = profilesFromApi
                .map(profile => {
                    return {
                        id: profile.user_id,
                        name: profile.name,
                        age: "?",
                        bio: profile.bio,
                        image: profile.photos && profile.photos.length > 0 
                               ? profile.photos[0].url 
                               : 'https://i.pravatar.cc/500?img=0'
                    };
                })
                .filter(profile => {
                    if (!profile) return false;
                    return !this.#seenService.has(profile.id);
                });

            this.#allProfiles.push(...newProfiles);
            console.log(`Adicionados ${newProfiles.length} novos perfis do backend.`);
            
            return newProfiles;
        } catch (error) {
            console.error("Não foi possível buscar perfis do backend:", error);
            return [];
        }
    }
}