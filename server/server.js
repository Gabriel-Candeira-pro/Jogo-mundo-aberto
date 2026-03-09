/**
 * Servidor Backend para Gayme
 * Gerencia armazenamento de dados no servidor
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'gayme-secret-key-change-in-production';
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ==================== UTILIDADES ====================

/**
 * Garante que o diretório de dados existe
 */
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

/**
 * Lê arquivo JSON
 */
async function readJSON(filename) {
    try {
        const data = await fs.readFile(path.join(DATA_DIR, filename), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
}

/**
 * Escreve arquivo JSON
 */
async function writeJSON(filename, data) {
    await ensureDataDir();
    await fs.writeFile(
        path.join(DATA_DIR, filename),
        JSON.stringify(data, null, 2),
        'utf8'
    );
}

/**
 * Gera token JWT
 */
function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Middleware de autenticação
 */
function authenticate(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

// ==================== AUTENTICAÇÃO ====================

/**
 * Registro de novo usuário
 */
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username e password são obrigatórios' });
        }
        
        // Carrega usuários existentes
        let users = await readJSON('users.json') || [];
        
        // Verifica se usuário já existe
        if (users.find(u => u.username === username || u.email === email)) {
            return res.status(409).json({ error: 'Usuário já existe' });
        }
        
        // Cria novo usuário
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            id: userId,
            username,
            email: email || '',
            passwordHash: hashedPassword,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        await writeJSON('users.json', users);
        
        const token = generateToken(userId);
        
        res.status(201).json({
            success: true,
            token,
            userId,
            username
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

/**
 * Login de usuário
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username e password são obrigatórios' });
        }
        
        const users = await readJSON('users.json') || [];
        const user = users.find(u => u.username === username);
        
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        
        const token = generateToken(user.id);
        
        res.json({
            success: true,
            token,
            userId: user.id,
            username: user.username
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

/**
 * Verifica token
 */
app.get('/api/auth/verify', authenticate, (req, res) => {
    res.json({ success: true, userId: req.userId });
});

// ==================== PERSONAGEM ====================

/**
 * Salvar personagem
 */
app.post('/api/character', authenticate, async (req, res) => {
    try {
        const characterData = req.body;
        const filename = `character_${req.userId}.json`;
        
        await writeJSON(filename, characterData);
        
        res.json({ success: true, message: 'Personagem salvo com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar personagem:', error);
        res.status(500).json({ error: 'Erro ao salvar personagem' });
    }
});

/**
 * Carregar personagem
 */
app.get('/api/character', authenticate, async (req, res) => {
    try {
        const filename = `character_${req.userId}.json`;
        const data = await readJSON(filename);
        
        if (!data) {
            return res.status(404).json({ error: 'Personagem não encontrado' });
        }
        
        res.json({ success: true, data });
    } catch (error) {
        console.error('Erro ao carregar personagem:', error);
        res.status(500).json({ error: 'Erro ao carregar personagem' });
    }
});

// ==================== USUÁRIO ====================

/**
 * Salvar dados do usuário
 */
app.post('/api/user', authenticate, async (req, res) => {
    try {
        const userData = req.body;
        const filename = `userdata_${req.userId}.json`;
        
        await writeJSON(filename, userData);
        
        res.json({ success: true, message: 'Dados do usuário salvos com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar dados do usuário:', error);
        res.status(500).json({ error: 'Erro ao salvar dados do usuário' });
    }
});

/**
 * Carregar dados do usuário
 */
app.get('/api/user', authenticate, async (req, res) => {
    try {
        const filename = `userdata_${req.userId}.json`;
        const data = await readJSON(filename);
        
        if (!data) {
            return res.status(404).json({ error: 'Dados do usuário não encontrados' });
        }
        
        res.json({ success: true, data });
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        res.status(500).json({ error: 'Erro ao carregar dados do usuário' });
    }
});

// ==================== MAPA GLOBAL MULTIPLAYER ====================

/**
 * Carregar mapa global compartilhado (usado por todos os jogadores)
 */
app.get('/api/map/global', authenticate, async (req, res) => {
    try {
        let mapData = await readJSON('global_map.json');
        
        // Se não existir, cria um mapa padrão
        if (!mapData) {
            mapData = {
                id: 'global_map_1',
                name: 'Arena Multiplayer',
                level: 1,
                difficulty: 1,
                platforms: [
                    { x: 400, y: 568, scaleX: 2, scaleY: 1 },
                    { x: 600, y: 400 },
                    { x: 50, y: 250 },
                    { x: 750, y: 220 }
                ],
                playerSpawn: { x: 100, y: 450 },
                stars: {
                    count: 12,
                    startX: 12,
                    startY: 0,
                    stepX: 70,
                    bounceY: { min: 0.4, max: 0.8 },
                    velocity: { minX: -50, maxX: 50, y: 20 }
                },
                completions: 0,
                highScore: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await writeJSON('global_map.json', mapData);
        }
        
        res.json({ success: true, data: mapData });
    } catch (error) {
        console.error('Erro ao carregar mapa global:', error);
        res.status(500).json({ error: 'Erro ao carregar mapa global' });
    }
});

/**
 * Atualizar mapa global (admin/sistema)
 */
app.post('/api/map/global', authenticate, async (req, res) => {
    try {
        const mapData = req.body;
        mapData.updatedAt = new Date().toISOString();
        
        await writeJSON('global_map.json', mapData);
        
        res.json({ success: true, message: 'Mapa global atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar mapa global:', error);
        res.status(500).json({ error: 'Erro ao salvar mapa global' });
    }
});

/**
 * Registrar jogador entrando no mapa
 */
app.post('/api/players/join', authenticate, async (req, res) => {
    try {
        let players = await readJSON('active_players.json') || [];
        
        const playerInfo = {
            userId: req.userId,
            username: req.body.username || 'Player',
            characterName: req.body.characterName || 'Hero',
            joinedAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };
        
        // Remove jogador se já existir (reconexão)
        players = players.filter(p => p.userId !== req.userId);
        
        // Adiciona jogador
        players.push(playerInfo);
        
        await writeJSON('active_players.json', players);
        
        res.json({ success: true, message: 'Jogador entrou no mapa', players: players.length });
    } catch (error) {
        console.error('Erro ao registrar jogador:', error);
        res.status(500).json({ error: 'Erro ao registrar jogador' });
    }
});

/**
 * Registrar jogador saindo do mapa
 */
app.post('/api/players/leave', authenticate, async (req, res) => {
    try {
        let players = await readJSON('active_players.json') || [];
        
        players = players.filter(p => p.userId !== req.userId);
        
        await writeJSON('active_players.json', players);
        
        res.json({ success: true, message: 'Jogador saiu do mapa' });
    } catch (error) {
        console.error('Erro ao remover jogador:', error);
        res.status(500).json({ error: 'Erro ao remover jogador' });
    }
});

/**
 * Listar jogadores online
 */
app.get('/api/players/online', authenticate, async (req, res) => {
    try {
        let players = await readJSON('active_players.json') || [];
        
        // Remove jogadores inativos (mais de 5 minutos sem atividade)
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        players = players.filter(p => {
            const lastActivity = new Date(p.lastActivity).getTime();
            return lastActivity > fiveMinutesAgo;
        });
        
        await writeJSON('active_players.json', players);
        
        res.json({ 
            success: true, 
            players: players.map(p => ({
                username: p.username,
                characterName: p.characterName,
                joinedAt: p.joinedAt
            }))
        });
    } catch (error) {
        console.error('Erro ao listar jogadores:', error);
        res.status(500).json({ error: 'Erro ao listar jogadores' });
    }
});

/**
 * Atualizar atividade do jogador (heartbeat)
 */
app.post('/api/players/heartbeat', authenticate, async (req, res) => {
    try {
        let players = await readJSON('active_players.json') || [];
        
        const player = players.find(p => p.userId === req.userId);
        if (player) {
            player.lastActivity = new Date().toISOString();
            await writeJSON('active_players.json', players);
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Erro no heartbeat:', error);
        res.status(500).json({ error: 'Erro no heartbeat' });
    }
});

// ==================== SESSÃO ====================

/**
 * Salvar sessão de jogo
 */
app.post('/api/session', authenticate, async (req, res) => {
    try {
        const sessionData = req.body;
        const filename = `session_${req.userId}.json`;
        
        await writeJSON(filename, sessionData);
        
        res.json({ success: true, message: 'Sessão salva com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar sessão:', error);
        res.status(500).json({ error: 'Erro ao salvar sessão' });
    }
});

/**
 * Carregar sessão de jogo
 */
app.get('/api/session', authenticate, async (req, res) => {
    try {
        const filename = `session_${req.userId}.json`;
        const data = await readJSON(filename);
        
        res.json({ success: true, data });
    } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        res.status(500).json({ error: 'Erro ao carregar sessão' });
    }
});

// ==================== BACKUP/RESTORE ====================

/**
 * Exportar todos os dados
 */
app.get('/api/export', authenticate, async (req, res) => {
    try {
        const data = {
            character: await readJSON(`character_${req.userId}.json`),
            user: await readJSON(`userdata_${req.userId}.json`),
            map: await readJSON(`map_current_${req.userId}.json`),
            maps: await readJSON(`maps_${req.userId}.json`),
            exportDate: new Date().toISOString()
        };
        
        res.json({ success: true, data });
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
        res.status(500).json({ error: 'Erro ao exportar dados' });
    }
});

/**
 * Importar todos os dados
 */
app.post('/api/import', authenticate, async (req, res) => {
    try {
        const { data } = req.body;
        
        if (data.character) {
            await writeJSON(`character_${req.userId}.json`, data.character);
        }
        if (data.user) {
            await writeJSON(`userdata_${req.userId}.json`, data.user);
        }
        if (data.map) {
            await writeJSON(`map_current_${req.userId}.json`, data.map);
        }
        if (data.maps) {
            await writeJSON(`maps_${req.userId}.json`, data.maps);
        }
        
        res.json({ success: true, message: 'Dados importados com sucesso' });
    } catch (error) {
        console.error('Erro ao importar dados:', error);
        res.status(500).json({ error: 'Erro ao importar dados' });
    }
});

// ==================== ROTAS DE TESTE ====================

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

// ==================== INICIALIZAÇÃO ====================

async function startServer() {
    await ensureDataDir();
    
    app.listen(PORT, () => {
        console.log('');
        console.log('╔════════════════════════════════════════════════╗');
        console.log('║       🎮 GAYME MULTIPLAYER SERVER 🎮          ║');
        console.log('╠════════════════════════════════════════════════╣');
        console.log(`║  Servidor rodando em: http://localhost:${PORT}    ║`);
        console.log('║  Diretório de dados: server/data              ║');
        console.log('║                                                ║');
        console.log('║  🌍 MODO MULTIPLAYER ATIVADO                   ║');
        console.log('║  • Mapa global compartilhado                   ║');
        console.log('║  • Todos os jogadores no mesmo mapa            ║');
        console.log('║                                                ║');
        console.log('║  Endpoints disponíveis:                        ║');
        console.log('║  • POST /api/auth/register                     ║');
        console.log('║  • POST /api/auth/login                        ║');
        console.log('║  • GET  /api/character                         ║');
        console.log('║  • POST /api/character                         ║');
        console.log('║  • GET  /api/user                              ║');
        console.log('║  • POST /api/user                              ║');
        console.log('║  • GET  /api/map/global (multiplayer)          ║');
        console.log('║  • POST /api/map/global (atualizar)            ║');
        console.log('║  • GET  /api/players/online                    ║');
        console.log('║  • POST /api/players/join                      ║');
        console.log('║  • POST /api/players/leave                     ║');
        console.log('║  • POST /api/players/heartbeat                 ║');
        console.log('║                                                ║');
        console.log('╚════════════════════════════════════════════════╝');
        console.log('');
    });
}

startServer().catch(console.error);

module.exports = app;
