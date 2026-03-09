import { GameSceneCore } from './gameScene/core/GameSceneCore.js';
import { attachInitializationMethods } from './gameScene/modules/data/initialization.js';
import { attachMultiplayerSyncMethods } from './gameScene/modules/data/multiplayer.js';
import { attachLifecycleMethods } from './gameScene/modules/data/lifecycle.js';
import { attachPlayerSetupMethods } from './gameScene/modules/player/setup.js';
import { attachMovementMethods } from './gameScene/modules/player/movement.js';
import { attachMapRenderMethods } from './gameScene/modules/map/renderer.js';
import { attachCollisionMethods } from './gameScene/modules/map/collision.js';
import { attachHUDMethods } from './gameScene/modules/ui/hud.js';
import { attachInstructionsMethods } from './gameScene/modules/ui/instructions.js';
import { attachResizeMethods } from './gameScene/modules/ui/resize.js';
import { attachInputMethods } from './gameScene/modules/input/controls.js';

// Cena principal do jogo
export class GameScene extends GameSceneCore {}

attachInitializationMethods(GameScene);
attachMultiplayerSyncMethods(GameScene);
attachLifecycleMethods(GameScene);
attachPlayerSetupMethods(GameScene);
attachMovementMethods(GameScene);
attachMapRenderMethods(GameScene);
attachCollisionMethods(GameScene);
attachHUDMethods(GameScene);
attachInstructionsMethods(GameScene);
attachResizeMethods(GameScene);
attachInputMethods(GameScene);
