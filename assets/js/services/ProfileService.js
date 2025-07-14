export class ProfileService {
    #profiles = [];

    constructor(jsonPath) {
        this.jsonPath = jsonPath;
    }

    async fetchProfiles() {
        if (this.#profiles.length > 0) {
            return this.#profiles;
        }

        try {
            const response = await fetch(this.jsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.#profiles = await response.json();
            return this.#profiles;
        } catch (error) {
            console.error("Could not fetch profiles:", error);
            return [];
        }
    }
}