const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/env');
const { readJSON, writeJSON } = require('../utils/fileStorage');

const USERS_INDEX_FILE = 'users/index.json';

function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

async function registerUser({ username, email, password }) {
    if (!username || !password) {
        return {
            error: { status: 400, body: { error: 'Username e password são obrigatórios' } }
        };
    }

    const users = (await readJSON(USERS_INDEX_FILE)) || [];

    if (users.find(u => u.username === username || u.email === email)) {
        return {
            error: { status: 409, body: { error: 'Usuário já existe' } }
        };
    }

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
    await writeJSON(USERS_INDEX_FILE, users);

    return {
        status: 201,
        body: {
            success: true,
            token: generateToken(userId),
            userId,
            username
        }
    };
}

async function loginUser({ username, password }) {
    if (!username || !password) {
        return {
            error: { status: 400, body: { error: 'Username e password são obrigatórios' } }
        };
    }

    const users = (await readJSON(USERS_INDEX_FILE)) || [];
    const user = users.find(u => u.username === username);

    if (!user) {
        return {
            error: { status: 401, body: { error: 'Credenciais inválidas' } }
        };
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
        return {
            error: { status: 401, body: { error: 'Credenciais inválidas' } }
        };
    }

    return {
        status: 200,
        body: {
            success: true,
            token: generateToken(user.id),
            userId: user.id,
            username: user.username
        }
    };
}

module.exports = {
    registerUser,
    loginUser
};
