export class SeenService {
    #seenIds; 

    constructor() {
        const storedIds = JSON.parse(localStorage.getItem('seenProfileIds')) || [];
        this.#seenIds = new Set(storedIds);
        console.log(`Loaded ${this.#seenIds.size} seen profiles from localStorage.`);
    }

    has(id) {
        return this.#seenIds.has(id);
    }

    add(id) {
        if (!this.has(id)) {
            this.#seenIds.add(id);
            this.#save();
        }
    }

    #save() {
        localStorage.setItem('seenProfileIds', JSON.stringify(Array.from(this.#seenIds)));
    }
}