import { App } from './components/App.js';
import { ProfileService } from './services/ProfileService.js';
import { SeenService } from './services/SeenService.js';

document.addEventListener('DOMContentLoaded', () => {
    const appElement = document.getElementById('app');
    
    const seenService = new SeenService();
    const apiUrl = 'https://rickandmortyapi.com/api/character';
    const profileService = new ProfileService(apiUrl, seenService);
    
    const myApp = new App(appElement, profileService, seenService);
    myApp.init();
});