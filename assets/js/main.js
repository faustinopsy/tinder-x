import { App } from './components/App.js';
import { SettingsService } from './services/SettingsService.js';
import { ProfileService } from './services/ProfileService.js';
import { SeenService } from './services/SeenService.js';

const appElement = document.getElementById('app');

const seenService = new SeenService();
const settingsService = new SettingsService();

const profileService = new ProfileService(seenService);

const myApp = new App(appElement, profileService, seenService, settingsService);
myApp.init();
