const { spawn } = require('child_process');
const ngrok = require('ngrok');

// Função para iniciar ngrok
async function startNgrok() {
  try {
    console.log('Iniciando ngrok...');
    
    // Aguarda um pouco para o webpack dev server iniciar
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
        console.log('\nPressione Ctrl+C para parar.\n');
        
      } catch (err) {
        console.error('Erro ao conectar ngrok:', err);
        process.exit(1);
      }
    }, 2000);

    // Inicia o webpack dev server
    const webpack = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      cwd: __dirname.replace(/scripts$/, ''),
    });

    // Limpa ngrok ao sair
    process.on('SIGINT', async () => {
      console.log('\n\nEncerrando ngrok e servidor...');
      await ngrok.kill();
      webpack.kill();
      process.exit(0);
    });

  } catch (err) {
    console.error('Erro fatal:', err);
    process.exit(1);
  }
}

startNgrok();
