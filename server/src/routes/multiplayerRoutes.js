const express = require('express');
const authenticate = require('../middlewares/authenticate');
const multiplayerController = require('../controllers/multiplayerController');
const chunkController = require('../controllers/chunkController');

const router = express.Router();

router.get('/map/global', authenticate, multiplayerController.getGlobalMap);
router.post('/map/global', authenticate, multiplayerController.updateGlobalMap);

router.post('/players/join', authenticate, multiplayerController.joinPlayer);
router.post('/players/leave', authenticate, multiplayerController.leavePlayer);
router.get('/players/online', authenticate, multiplayerController.getOnlinePlayers);
router.post('/players/heartbeat', authenticate, multiplayerController.heartbeatPlayer);

// Endpoint GET /api/map/chunk?x=&y=
router.get('/map/chunk', authenticate, chunkController.getChunk);

module.exports = router;
