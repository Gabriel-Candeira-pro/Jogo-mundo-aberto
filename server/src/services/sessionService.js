const { readJSON, writeJSON } = require('../utils/fileStorage');

function userSessionFile(userId) {
    return `users/${userId}/session.json`;
}

async function saveSession(userId, sessionData) {
    const filename = userSessionFile(userId);
    await writeJSON(filename, sessionData);

    return { success: true, message: 'Sessão salva com sucesso' };
}

async function getSession(userId) {
    const filename = userSessionFile(userId);
    const data = await readJSON(filename);

    return { success: true, data };
}

module.exports = {
    saveSession,
    getSession
};
