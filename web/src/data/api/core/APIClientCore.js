/**
 * Núcleo do cliente API com responsabilidades base
 */
export class APIClientCore {
    constructor(baseURL = null) {
        this.baseURL = this.resolveBaseURL(baseURL);
        this.token = localStorage.getItem('gayme_auth_token');
        this.requestTimeoutMs = 20000;
        this.maxRetries = 2;
        this.retryDelayMs = 1200;
    }

    /**
     * Resolve URL base da API com fallback para ambiente local.
     */
    resolveBaseURL(explicitBaseURL) {
        if (explicitBaseURL) {
            return explicitBaseURL.replace(/\/$/, '');
        }

        if (typeof window === 'undefined') {
            return 'http://localhost:3000';
        }

        const storageBaseURL = window.localStorage.getItem('gayme_api_base_url');
        if (storageBaseURL) {
            return storageBaseURL.replace(/\/$/, '');
        }

        const { hostname, origin, port } = window.location;
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
        const isTunnelHost = /(?:ngrok\.io|ngrok-free\.app|trycloudflare\.com)$/.test(hostname);

        if (port === '8080' || isTunnelHost) {
            return origin;
        }

        if (isLocal) {
            return 'http://localhost:3000';
        }

        return origin.replace(/\/$/, '');
    }

    /**
     * Pequeno backoff para re-tentativas de rede.
     */
    async wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Faz requisição HTTP
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const {
            timeoutMs: customTimeoutMs,
            retryCount: customRetryCount,
            retryDelayMs: customRetryDelayMs,
            ...fetchOptions
        } = options;
        const timeoutMs = customTimeoutMs || this.requestTimeoutMs;
        const retryCount = Number.isInteger(customRetryCount) ? customRetryCount : this.maxRetries;
        const retryDelayMs = customRetryDelayMs || this.retryDelayMs;
        const headers = {
            'Content-Type': 'application/json',
            ...fetchOptions.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        for (let attempt = 0; attempt <= retryCount; attempt++) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

            try {
                const response = await fetch(url, {
                    ...fetchOptions,
                    headers,
                    signal: controller.signal
                });

                const contentType = response.headers.get('content-type') || '';
                const data = contentType.includes('application/json')
                    ? await response.json()
                    : {};

                if (!response.ok) {
                    throw new Error(data.error || 'Erro na requisição');
                }

                return data;
            } catch (error) {
                const isAbort = error.name === 'AbortError';
                const isNetworkError = error instanceof TypeError;
                const canRetry = attempt < retryCount && (isAbort || isNetworkError);

                if (canRetry) {
                    const nextAttempt = attempt + 2;
                    console.warn(`Tentativa ${attempt + 1} falhou. Re-tentando (${nextAttempt}/${retryCount + 1})...`);
                    await this.wait(retryDelayMs * (attempt + 1));
                    continue;
                }

                if (isAbort) {
                    throw new Error(`Timeout ao conectar com servidor (${timeoutMs}ms)`);
                }

                console.error('Erro na requisição:', error);
                throw error;
            } finally {
                clearTimeout(timeoutId);
            }
        }

        throw new Error('Falha inesperada na requisição');
    }

    /**
     * Define o token de autenticação
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('gayme_auth_token', token);
    }

    /**
     * Remove o token de autenticação
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('gayme_auth_token');
    }

    /**
     * Verifica se está autenticado
     */
    isAuthenticated() {
        return !!this.token;
    }
}
