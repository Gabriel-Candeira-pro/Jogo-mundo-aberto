const path = require('path');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'gayme-secret-key-change-in-production';
const DATA_DIR = path.join(__dirname, '../../data');
const WORLD_SEED = process.env.WORLD_SEED || null;

module.exports = {
    PORT,
    JWT_SECRET,
    DATA_DIR
    ,WORLD_SEED
};
