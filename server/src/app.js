const express = require('express');
const cors = require('cors');
const { requestLogger } = require('./utils/logger');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const multiplayerRoutes = require('./routes/multiplayerRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const backupRoutes = require('./routes/backupRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
    res.json({
        message: 'Gayme Multiplayer API Server',
        version: '2.0.0',
        mode: 'multiplayer',
        endpoints: {
            auth: '/api/auth/*',
            character: '/api/character',
            user: '/api/user',
            globalMap: '/api/map/global',
            players: '/api/players/*',
            session: '/api/session'
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', multiplayerRoutes);
app.use('/api', sessionRoutes);
app.use('/api', backupRoutes);

module.exports = app;
