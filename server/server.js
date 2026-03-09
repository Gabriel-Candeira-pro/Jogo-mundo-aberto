const app = require('./src/app');
const { PORT } = require('./src/config/env');
const { ensureDataDir } = require('./src/utils/fileStorage');
const { logServerStart } = require('./src/utils/logger');

async function startServer() {
    await ensureDataDir();

    app.listen(PORT, () => {
        logServerStart(PORT);
    });
}

startServer().catch(console.error);

module.exports = app;
