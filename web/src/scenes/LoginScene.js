/**
 * Cena de Login/Registro
 * LOGIN OBRIGATÓRIO - Modo Multiplayer Online
 */

import Phaser from 'phaser';
import { authManager } from '../data/AuthManager.js';

export class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
        this.modalRoot = null;
        this.modalCleanup = null;
        this.isSubmitting = false;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.events.once('shutdown', () => this.cleanupModal());
        this.events.once('destroy', () => this.cleanupModal());

        // Fundo com leve gradiente para deixar a tela inicial menos "crua".
        this.add.rectangle(width / 2, height / 2, width, height, 0x050811).setOrigin(0.5);
        this.add.circle(width * 0.2, height * 0.2, 180, 0x0b3d1f, 0.15);
        this.add.circle(width * 0.8, height * 0.78, 220, 0x003b66, 0.16);

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

            this.add.text(width / 2, 450, 'Atalho: ENTER para jogar', {
                fontSize: '14px',
                fill: '#c6f5c6',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            this.input.keyboard?.once('keydown-ENTER', () => {
                this.scene.start('PreloadScene');
            });

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
                this.showLoginForm('login');
            }, '#00b300');

            this.add.text(width / 2, 380, 'ENTER: abrir login  |  R: abrir registro', {
                fontSize: '14px',
                fill: '#c6f5c6',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            this.input.keyboard?.once('keydown-ENTER', () => {
                this.showLoginForm('login');
            });
            this.input.keyboard?.once('keydown-R', () => {
                this.showLoginForm('register');
            });
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

    showLoginForm(initialMode = 'login') {
        if (this.modalRoot) {
            const usernameInput = this.modalRoot.querySelector('#username');
            usernameInput?.focus();
            return;
        }

        // Cria um formulário HTML para login OBRIGATÓRIO
        const formHTML = `
            <div id="login-overlay" style="
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.65);
                backdrop-filter: blur(2px);
                z-index: 999;
            "></div>
            <div id="login-modal" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(145deg, #1f2538, #171d2f);
                padding: 30px;
                border-radius: 14px;
                border: 1px solid #2f3e61;
                box-shadow: 0 12px 40px rgba(0,0,0,0.65);
                z-index: 1000;
                min-width: 360px;
                width: min(92vw, 420px);
            ">
                <h2 style="color: #00b300; margin-top: 0;">🔑 Login / Registro</h2>
                <p style="color: #FFFF00; font-size: 14px; margin-top: -10px;">
                    Login obrigatório para modo multiplayer
                </p>

                <div style="display: flex; gap: 10px; margin: 12px 0 16px;">
                    <button type="button" id="mode-login" style="
                        flex: 1;
                        padding: 10px;
                        border-radius: 6px;
                        border: 1px solid #4b6f3a;
                        background: #233122;
                        color: #d9ffd9;
                        cursor: pointer;
                        font-weight: bold;
                    ">Entrar</button>
                    <button type="button" id="mode-register" style="
                        flex: 1;
                        padding: 10px;
                        border-radius: 6px;
                        border: 1px solid #355b88;
                        background: #1a2740;
                        color: #d2e8ff;
                        cursor: pointer;
                        font-weight: bold;
                    ">Criar conta</button>
                </div>
                
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

                    <div id="confirm-wrapper" style="margin-bottom: 15px; display: none;">
                        <label for="confirm-password" style="color: #FFF; display: block; margin-bottom: 5px;">Confirmar senha:</label>
                        <input type="password" id="confirm-password" placeholder="Repita sua senha" autocomplete="new-password" style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #0066FF;
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
                    <button type="button" id="login-btn" style="
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
                    
                    <button type="button" id="register-btn" style="
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

                <button type="button" id="close-btn" style="
                    margin-top: 10px;
                    width: 100%;
                    padding: 10px;
                    background: transparent;
                    border: 1px solid #5c5c5c;
                    border-radius: 5px;
                    color: #ccc;
                    cursor: pointer;
                ">Fechar (Esc)</button>

                <p style="color: #999; font-size: 12px; margin-top: 15px; text-align: center;">
                    ⚠️ Backend deve estar ativo (porta 3000) para login/multiplayer<br>
                    Execute: npm run dev:server<br>
                    Atalhos: Enter envia | Ctrl+Enter registra
                </p>
            </div>
        `;

        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = formHTML;
        document.body.appendChild(modalDiv);
        this.modalRoot = modalDiv;

        const showMessage = (msg, isError = true) => {
            const msgEl = document.getElementById('message');
            msgEl.textContent = msg;
            msgEl.style.color = isError ? '#FF6666' : '#00FF00';
        };

        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const modeLoginBtn = document.getElementById('mode-login');
        const modeRegisterBtn = document.getElementById('mode-register');
        const closeBtn = document.getElementById('close-btn');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirm-password');
        const confirmWrapper = document.getElementById('confirm-wrapper');
        const overlay = document.getElementById('login-overlay');
        let currentMode = initialMode === 'register' ? 'register' : 'login';

        const setButtonsDisabled = (disabled) => {
            loginBtn.disabled = disabled;
            registerBtn.disabled = disabled;
            modeLoginBtn.disabled = disabled;
            modeRegisterBtn.disabled = disabled;
            closeBtn.disabled = disabled;
            usernameInput.disabled = disabled;
            passwordInput.disabled = disabled;
            confirmInput.disabled = disabled;
            loginBtn.style.opacity = disabled ? '0.65' : '1';
            registerBtn.style.opacity = disabled ? '0.65' : '1';
        };

        const setMode = (mode) => {
            currentMode = mode;
            const isRegister = mode === 'register';
            confirmWrapper.style.display = isRegister ? 'block' : 'none';
            modeLoginBtn.style.boxShadow = isRegister ? 'none' : 'inset 0 0 0 2px #00b300';
            modeRegisterBtn.style.boxShadow = isRegister ? 'inset 0 0 0 2px #0066FF' : 'none';
            showMessage(
                isRegister
                    ? 'Modo registro ativo. Use Ctrl+Enter para criar conta.'
                    : 'Modo login ativo. Pressione Enter para entrar.',
                false
            );
        };

        const closeModal = () => {
            this.cleanupModal();
        };

        const validateCredentials = (mode) => {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmInput.value;

            if (!username || !password) {
                return { valid: false, error: '⚠️ Preencha usuário e senha.' };
            }

            if (username.length < 3 || username.length > 20) {
                return { valid: false, error: '⚠️ Usuário deve ter entre 3 e 20 caracteres.' };
            }

            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                return { valid: false, error: '⚠️ Use apenas letras, números e underscore no usuário.' };
            }

            if (password.length < 4) {
                return { valid: false, error: '⚠️ Senha deve ter pelo menos 4 caracteres.' };
            }

            if (mode === 'register' && password !== confirmPassword) {
                return { valid: false, error: '⚠️ As senhas não conferem.' };
            }

            return { valid: true, username, password };
        };

        const submitAuth = async (mode) => {
            if (this.isSubmitting) {
                return;
            }

            const credentials = validateCredentials(mode);
            if (!credentials.valid) {
                showMessage(credentials.error);
                return;
            }

            this.isSubmitting = true;
            setButtonsDisabled(true);

            const actionLabel = mode === 'register' ? 'Criando conta...' : 'Conectando ao servidor...';
            showMessage(`🔄 ${actionLabel}`, false);

            try {
                const serverOnline = await authManager.checkServerStatus();
                if (!serverOnline) {
                    showMessage('❌ Servidor offline. Inicie com: npm run dev:server');
                    return;
                }

                const result = mode === 'register'
                    ? await authManager.register(credentials.username, credentials.password)
                    : await authManager.login(credentials.username, credentials.password);

                if (result.success) {
                    showMessage(
                        mode === 'register'
                            ? '✅ Conta criada! Entrando no jogo...'
                            : '✅ Login realizado! Entrando no jogo...',
                        false
                    );

                    setTimeout(() => {
                        closeModal();
                        this.scene.restart();
                    }, 250);
                } else {
                    showMessage('❌ ' + (result.error || 'Falha na autenticação'));
                }
            } catch (error) {
                showMessage('❌ Erro de conexão. Verifique backend/rede e tente novamente.');
            } finally {
                this.isSubmitting = false;
                setButtonsDisabled(false);
            }
        };

        // Focus no campo de usuário
        setTimeout(() => {
            usernameInput.focus();
        }, 100);

        // Enter executa o modo ativo. Ctrl+Enter força registro.
        const form = document.getElementById('auth-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            submitAuth(currentMode);
        });

        const keyHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeModal();
                return;
            }

            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                setMode('register');
                submitAuth('register');
                return;
            }

            if (e.key.toLowerCase() === 'r' && e.altKey) {
                e.preventDefault();
                setMode('register');
                return;
            }

            if (e.key.toLowerCase() === 'l' && e.altKey) {
                e.preventDefault();
                setMode('login');
            }
        };

        modeLoginBtn.onclick = () => setMode('login');
        modeRegisterBtn.onclick = () => setMode('register');
        loginBtn.onclick = () => submitAuth('login');
        registerBtn.onclick = () => submitAuth('register');
        closeBtn.onclick = closeModal;
        overlay.onclick = closeModal;
        document.addEventListener('keydown', keyHandler);

        this.modalCleanup = () => {
            document.removeEventListener('keydown', keyHandler);
        };

        setMode(currentMode);
    }

    cleanupModal() {
        if (this.modalCleanup) {
            this.modalCleanup();
            this.modalCleanup = null;
        }

        if (this.modalRoot) {
            this.modalRoot.remove();
            this.modalRoot = null;
        }

        this.isSubmitting = false;
    }
}
