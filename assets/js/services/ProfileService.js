export class ProfileService {
    #profiles = [];
    #apiUrl; 

    constructor(apiUrl) {
        this.#apiUrl = apiUrl;
    }

    async fetchProfiles() {
        if (this.#profiles.length > 0) {
            return this.#profiles;
        }

        try {
            const response = await fetch(this.#apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            this.#profiles = data.results.map(character => {
                return {
                    name: character.name,
                    age: character.species, 
                    bio: `A(n) ${character.species} from ${character.origin.name}. Currently ${character.status}.`,
                    image: character.image
                };
            });
            
            return this.#profiles;
        } catch (error) {
            console.error("Could not fetch profiles from API:", error);
            return [];
        }
    }
}