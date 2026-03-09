const { exec } = require('child_process');
const net = require('net');

const PORTS = [3000, 8080];

function execAsync(command) {
  return new Promise((resolve) => {
    exec(command, (error, stdout) => {
      resolve({ error, stdout: stdout || '' });
    });
  });
}

function canListen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (error) => {
      if (error && error.code === 'EADDRINUSE') {
        resolve(false);
        return;
      }

      resolve(false);
    });

    server.once('listening', () => {
      server.close(() => resolve(true));
    });

    server.listen(port, '0.0.0.0');
  });
}

async function getListeningPids(port) {
  if (process.platform === 'win32') {
    const { stdout } = await execAsync(`netstat -ano -p tcp | findstr :${port}`);
    return stdout
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.toUpperCase().includes('LISTENING'))
      .map((line) => line.split(/\s+/).pop())
      .filter(Boolean)
      .map((pid) => Number(pid))
      .filter((pid) => Number.isInteger(pid) && pid > 0);
  }

  const { stdout } = await execAsync(`lsof -tiTCP:${port} -sTCP:LISTEN 2>/dev/null || true`);
  return stdout
    .split('\n')
    .map((value) => Number(value.trim()))
    .filter((pid) => Number.isInteger(pid) && pid > 0);
}

function processExists(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (_error) {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function killPid(pid) {
  if (!processExists(pid)) {
    return;
  }

  try {
    process.kill(pid, 'SIGTERM');
  } catch (_error) {
    return;
  }

  await sleep(700);

  if (processExists(pid)) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch (_error) {
      // Ignore if it exited between checks.
    }
  }
}

async function ensurePortIsFree(port) {
  if (await canListen(port)) {
    console.log(`[prefull] Porta ${port} livre.`);
    return;
  }

  const pids = [...new Set(await getListeningPids(port))].filter((pid) => pid !== process.pid);

  if (pids.length === 0) {
    throw new Error(`[prefull] Porta ${port} em uso, mas nao foi possivel identificar PID.`);
  }

  console.log(`[prefull] Porta ${port} ocupada. Encerrando PID(s): ${pids.join(', ')}`);

  for (const pid of pids) {
    await killPid(pid);
  }

  await sleep(400);

  if (!(await canListen(port))) {
    throw new Error(`[prefull] Porta ${port} continua ocupada apos tentativa automatica.`);
  }

  console.log(`[prefull] Porta ${port} liberada.`);
}

async function main() {
  console.log('[prefull] Verificando portas 3000 e 8080...');

  for (const port of PORTS) {
    await ensurePortIsFree(port);
  }

  console.log('[prefull] Ambiente pronto para "npm run full".');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
