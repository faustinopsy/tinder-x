import { App } from './components/App.js';
import { ProfileService } from './services/ProfileService.js';

document.addEventListener('DOMContentLoaded', () => {
    const appElement = document.getElementById('app');
    
    const apiUrl = 'https://rickandmortyapi.com/api/character';
    const profileService = new ProfileService(apiUrl);
    
    const myApp = new App(appElement, profileService);
    myApp.init();
});