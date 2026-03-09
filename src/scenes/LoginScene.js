/**
 * Cena de Login/Registro
 * LOGIN OBRIGATÓRIO - Modo Multiplayer Online
 */

import Phaser from 'phaser';
import { authManager } from '../data/AuthManager.js';
import { dataManager } from '../data/DataManagerHybrid.js';

export class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Título
        this.add.text(width / 2, 80, 'GAYME', {
            fontSize: '72px',
            fill: '#00b300',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Subtítulo MULTIPLAYER
        this.add.text(width / 2, 160, '🌍 MODO MULTIPLAYER ONLINE', {
            fontSize: '28px',
            fill: '#00FF00',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Informação do modo
        if (authManager.isAuthenticated()) {
            const user = authManager.getCurrentUser();
            
            this.add.text(width / 2, 210, `✅ Conectado como: ${user?.username || 'Usuário'}`, {
                fontSize: '20px',
                fill: '#00FF00',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            this.add.text(width / 2, 250, 'Todos os jogadores compartilham o mesmo mapa!', {
                fontSize: '16px',
                fill: '#FFFF00',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            // Botão: Jogar
            this.createButton(width / 2, 320, '🎮 JOGAR', () => {
                this.scene.start('PreloadScene');
            }, '#00b300');

            // Botão: Deslogar
            this.createButton(width / 2, 400, 'Trocar Conta', () => {
                authManager.logout();
                this.scene.restart();
            }, '#666666');

        } else {
            // NÃO AUTENTICADO - LOGIN OBRIGATÓRIO
            this.add.text(width / 2, 210, '⚠️ LOGIN OBRIGATÓRIO PARA JOGAR', {
                fontSize: '20px',
                fill: '#FF6666',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.add.text(width / 2, 250, 'Entre ou crie uma conta para acessar o mapa multiplayer', {
                fontSize: '16px',
                fill: '#CCCCCC',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            // Botão: Login/Registro
            this.createButton(width / 2, 320, '🔑 LOGIN / REGISTRO', () => {
                this.showLoginForm();
            }, '#00b300');
        }

        // Informações sobre multiplayer
        this.add.text(width / 2, height - 120, 
            '🎮 CARACTERÍSTICAS DO MULTIPLAYER:', {
            fontSize: '16px',
            fill: '#00b300',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(width / 2, height - 80, 
            '• Mapa único compartilhado por todos\n• Seus dados salvos no servidor\n• Jogue com outros players online', {
            fontSize: '14px',
            fill: '#999',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);
    }

    createButton(x, y, text, callback, color = '#00b300') {
        const button = this.add.text(x, y, text, {
            fontSize: '28px',
            fill: '#FFF',
            fontFamily: 'Arial',
            backgroundColor: color,
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5);

        button.setInteractive({ useHandCursor: true });
        
        button.on('pointerover', () => {
            button.setScale(1.05);
        });

        button.on('pointerout', () => {
            button.setScale(1);
        });

        button.on('pointerdown', callback);

        return button;
    }

    showLoginForm() {
        // Cria um formulário HTML para login OBRIGATÓRIO
        const formHTML = `
            <div id="login-modal" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #2d2d44;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                z-index: 1000;
                min-width: 350px;
            ">
                <h2 style="color: #00b300; margin-top: 0;">🔑 Login / Registro</h2>
                <p style="color: #FFFF00; font-size: 14px; margin-top: -10px;">
                    Login obrigatório para modo multiplayer
                </p>
                
                <form id="auth-form">
                    <div style="margin-bottom: 15px;">
                        <label for="username" style="color: #FFF; display: block; margin-bottom: 5px;">Usuário:</label>
                        <input type="text" id="username" placeholder="Digite seu usuário" autocomplete="username" style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #00b300;
                            border-radius: 5px;
                            background: #1a1a2e;
                            color: #FFF;
                            font-size: 16px;
                        " />
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label for="password" style="color: #FFF; display: block; margin-bottom: 5px;">Senha:</label>
                        <input type="password" id="password" placeholder="Digite sua senha" autocomplete="current-password" style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #00b300;
                            border-radius: 5px;
                            background: #1a1a2e;
                            color: #FFF;
                            font-size: 16px;
                        " />
                    </div>
                </form>

                <div id="message" style="
                    color: #FF6666;
                    margin-bottom: 15px;
                    min-height: 20px;
                "></div>

                <div style="display: flex; gap: 10px;">
                    <button id="login-btn" style="
                        flex: 1;
                        padding: 12px;
                        background: #00b300;
                        color: #FFF;
                        border: none;
                        border-radius: 5px;
                        font-size: 18px;
                        cursor: pointer;
                        font-weight: bold;
                    ">ENTRAR</button>
                    
                    <button id="register-btn" style="
                        flex: 1;
                        padding: 12px;
                        background: #0066FF;
                        color: #FFF;
                        border: none;
                        border-radius: 5px;
                        font-size: 18px;
                        cursor: pointer;
                        font-weight: bold;
                    ">CRIAR CONTA</button>
                </div>

                <p style="color: #999; font-size: 12px; margin-top: 15px; text-align: center;">
                    ⚠️ Backend deve estar ativo (porta 3000) para login/multiplayer<br>
                    Execute: npm run dev:server
                </p>
            </div>
        `;

        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = formHTML;
        document.body.appendChild(modalDiv);

        const showMessage = (msg, isError = true) => {
            const msgEl = document.getElementById('message');
            msgEl.textContent = msg;
            msgEl.style.color = isError ? '#FF6666' : '#00FF00';
        };

        // Focus no campo de usuário
        setTimeout(() => {
            document.getElementById('username').focus();
        }, 100);

        // Enter envia o formulario de login por padrao.
        document.getElementById('auth-form').addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('login-btn').click();
        });

        document.getElementById('login-btn').onclick = async () => {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (!username || !password) {
                showMessage('⚠️ Preencha todos os campos!');
                return;
            }

            showMessage('🔄 Conectando ao servidor...', false);

            try {
                const result = await authManager.login(username, password);
                
                if (result.success) {
                    showMessage('✅ Login realizado! Carregando jogo...', false);
                    modalDiv.remove();
                    this.scene.restart();
                } else {
                    showMessage('❌ ' + (result.error || 'Erro ao fazer login'));
                }
            } catch (error) {
                showMessage('❌ Erro de conexão! Verifique se o servidor está rodando.');
            }
        };

        document.getElementById('register-btn').onclick = async () => {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (!username || !password) {
                showMessage('⚠️ Preencha todos os campos!');
                return;
            }

            if (password.length < 4) {
                showMessage('⚠️ Senha deve ter pelo menos 4 caracteres!');
                return;
            }

            showMessage('🔄 Criando conta...', false);

            try {
                const result = await authManager.register(username, password);
                
                if (result.success) {
                    showMessage('✅ Conta criada! Carregando jogo...', false);
                    modalDiv.remove();
                    this.scene.restart();
                } else {
                    showMessage('❌ ' + (result.error || 'Erro ao registrar'));
                }
            } catch (error) {
                showMessage('❌ Erro de conexão! Verifique se o servidor está rodando.');
            }
        };
    }
}
