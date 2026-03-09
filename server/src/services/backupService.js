const { readJSON, writeJSON } = require('../utils/fileStorage');

function userFile(userId, filename) {
    return `users/${userId}/${filename}`;
}

async function exportAllData(userId) {
    const data = {
        character: await readJSON(userFile(userId, 'character.json')),
        user: await readJSON(userFile(userId, 'userdata.json')),
        map: await readJSON(userFile(userId, 'map_current.json')),
        maps: await readJSON(userFile(userId, 'maps.json')),
        exportDate: new Date().toISOString()
    };

    return { success: true, data };
}

async function importAllData(userId, importData) {
    if (importData.character) {
        await writeJSON(userFile(userId, 'character.json'), importData.character);
    }
    if (importData.user) {
        await writeJSON(userFile(userId, 'userdata.json'), importData.user);
    }
    if (importData.map) {
        await writeJSON(userFile(userId, 'map_current.json'), importData.map);
    }
    if (importData.maps) {
        await writeJSON(userFile(userId, 'maps.json'), importData.maps);
    }

    return { success: true, message: 'Dados importados com sucesso' };
}

module.exports = {
    exportAllData,
    importAllData
};
