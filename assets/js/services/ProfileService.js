export class ProfileService {
    #allProfiles = [];
    #nextPageUrl;
    #isLoading = false;
    #seenService;

    constructor(initialApiUrl, seenService) {
        this.#nextPageUrl = initialApiUrl;
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
        if (this.#isLoading || !this.#nextPageUrl) {
            return [];
        }

        this.#isLoading = true;
        console.log(`Fetching more profiles from: ${this.#nextPageUrl}`);

        try {
            const response = await fetch(this.#nextPageUrl);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const data = await response.json();
            
            this.#nextPageUrl = data.info.next;

            const newProfiles = data.results
                .map(character => ({
                    id: character.id,
                    name: character.name,
                    age: character.species,
                    bio: `A(n) ${character.species} from ${character.origin.name}. Currently ${character.status}.`,
                    image: character.image
                }))
                .filter(profile => !this.#seenService.has(profile.id)); 

            this.#allProfiles.push(...newProfiles);
            
            console.log(`Added ${newProfiles.length} new profiles.`);

            return newProfiles;

        } catch (error) {
            console.error("Could not fetch more profiles from API:", error);
            this.#nextPageUrl = null;
            return [];
        } finally {
            this.#isLoading = false;
        }
    }
}