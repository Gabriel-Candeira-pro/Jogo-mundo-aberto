import { attachSetupUI } from './setupUI.js';
import { attachLocationDisplay } from './locationDisplay.js';

export function attachHUDMethods(GameSceneClass) {
    // Compose small responsibilities into the HUD attachment
    attachSetupUI(GameSceneClass);
    attachLocationDisplay(GameSceneClass);
}

export default attachHUDMethods;
