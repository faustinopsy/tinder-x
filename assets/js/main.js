import { App } from './components/App.js';
import { ProfileService } from './services/ProfileService.js';

document.addEventListener('DOMContentLoaded', () => {
    const appElement = document.getElementById('app');
    const profileService = new ProfileService('../../data/profiles.json');
    
    const myApp = new App(appElement, profileService);
    myApp.init();
});