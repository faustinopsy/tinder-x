export class SettingsService {
    #defaults = {
        theme: 'dark-yellow',
        menuStyle: 'bottom'
    };

    constructor() {
        this.settings = {};
    }

    init() {
        Object.keys(this.#defaults).forEach(key => {
            const savedValue = localStorage.getItem(key);
            this.settings[key] = savedValue || this.#defaults[key];
            this.#applySetting(key, this.settings[key]);
        });
    }

    get(key) {
        return this.settings[key];
    }

    save(key, value) {
        this.settings[key] = value;
        localStorage.setItem(key, value);
        this.#applySetting(key, value);

        document.dispatchEvent(new CustomEvent('setting-changed', {
            detail: { key, value }
        }));
    }

    #applySetting(key, value) {
        if (key === 'theme') {
            document.body.className = ''; 
            document.body.classList.add(`theme-${value}`);
        }
    }
}