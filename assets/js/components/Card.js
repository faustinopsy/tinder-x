export class Card {
    constructor({ name, age, bio, image }) {
        this.name = name;
        this.age = age;
        this.bio = bio;
        this.image = image;
    }

    render() {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        cardElement.innerHTML = `
            <img src="${this.image}" alt="${this.name}" class="card__image">
            <div class="card__info">
                <h2 class="card__name-age">${this.name}, ${this.age}</h2>
                <p class="card__bio">${this.bio}</p>
            </div>
        `;
        return cardElement;
    }
}