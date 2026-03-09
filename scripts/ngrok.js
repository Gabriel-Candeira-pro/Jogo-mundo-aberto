const { spawn } = require('child_process');
const ngrok = require('ngrok');

const ROOT_DIR = __dirname.replace(/scripts$/, '');

function spawnProcess(command, args) {
  return spawn(command, args, {
    stdio: 'inherit',
    cwd: ROOT_DIR,
    shell: false,
  });
}

// Função para iniciar ngrok
async function startNgrok() {
  try {
    console.log('Iniciando backend + frontend + ngrok...');

    const backend = spawnProcess('npm', ['run', 'dev:server']);
    const webpack = spawnProcess('npm', ['run', 'dev']);
    
    // Aguarda frontend e backend subirem antes de criar tunel.
    setTimeout(async () => {
      try {
        const url = await ngrok.connect({
          proto: 'http',
          addr: 8080,
          onStatusChange: (status) => {
            console.log(`ngrok status: ${status}`);
          },
        });
        
        console.log('\n ✅ Servidor público iniciado!');
        console.log(`📱 URL pública: ${url}`);
        console.log(`🖥️  Servidor local: http://localhost:8080`);
        console.log('🌐 API encaminhada via proxy para http://localhost:3000');
        console.log('\nPressione Ctrl+C para parar.\n');
        
      } catch (err) {
        console.error('Erro ao conectar ngrok:', err);
        backend.kill();
        webpack.kill();
        process.exit(1);
      }
    }, 5000);

    // Limpa ngrok ao sair
    process.on('SIGINT', async () => {
      console.log('\n\nEncerrando ngrok e servidor...');
      await ngrok.kill();
      backend.kill();
      webpack.kill();
      process.exit(0);
    });

    const exitHandler = async (code) => {
      if (code !== 0) {
        console.error(`Processo filho finalizou com codigo ${code}. Encerrando tunel...`);
      }
      await ngrok.kill();
      backend.kill();
      webpack.kill();
      process.exit(code || 0);
    };

    backend.on('exit', exitHandler);
    webpack.on('exit', exitHandler);

  } catch (err) {
    console.error('Erro fatal:', err);
    process.exit(1);
  }
}

startNgrok();
