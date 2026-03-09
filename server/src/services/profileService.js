const { readJSON, writeJSON } = require('../utils/fileStorage');

function userFile(userId, filename) {
    return `users/${userId}/${filename}`;
}

async function saveCharacter(userId, characterData) {
    const filename = userFile(userId, 'character.json');
    await writeJSON(filename, characterData);
    return { success: true, message: 'Personagem salvo com sucesso' };
}

async function getCharacter(userId) {
    const filename = userFile(userId, 'character.json');
    const data = await readJSON(filename);

    if (!data) {
        return { error: { status: 404, body: { error: 'Personagem não encontrado' } } };
    }

    return { success: true, data };
}

async function saveUserData(userId, userData) {
    const filename = userFile(userId, 'userdata.json');
    await writeJSON(filename, userData);
    return { success: true, message: 'Dados do usuário salvos com sucesso' };
}

async function getUserData(userId) {
    const filename = userFile(userId, 'userdata.json');
    const data = await readJSON(filename);

    if (!data) {
        return { error: { status: 404, body: { error: 'Dados do usuário não encontrados' } } };
    }

    return { success: true, data };
}

module.exports = {
    saveCharacter,
    getCharacter,
    saveUserData,
    getUserData
};
