import { App } from './components/App.js';
import { ProfileService } from './services/ProfileService.js';
import { SeenService } from './services/SeenService.js';
import { SettingsService } from './services/SettingsService.js';

document.addEventListener('DOMContentLoaded', () => {
    const appElement = document.getElementById('app');
    
    const seenService = new SeenService();
    const settingsService = new SettingsService();
    const profileService = new ProfileService(seenService);
    
    const myApp = new App(appElement, profileService, seenService, settingsService);
    myApp.init();
});