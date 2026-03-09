#!/usr/bin/env bash
set -euo pipefail

PORTS=(3000 8080)

# Garante que o script rode a partir da raiz do projeto.
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

has_command() {
    command -v "$1" >/dev/null 2>&1
}

pids_for_port() {
    local port="$1"

    if has_command lsof; then
        lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true
        return
    fi

    if has_command fuser; then
        fuser -n tcp "$port" 2>/dev/null | tr ' ' '\n' | grep -E '^[0-9]+$' || true
        return
    fi

    if has_command ss; then
        ss -ltnp 2>/dev/null \
            | grep -E ":${port}\\b" \
            | sed -n 's/.*pid=\([0-9]\+\).*/\1/p' \
            | sort -u || true
        return
    fi

    echo "Erro: nenhum comando para inspeção de portas encontrado (lsof, fuser ou ss)." >&2
    exit 1
}

kill_port_processes() {
    local port="$1"
    local pids

    pids="$(pids_for_port "$port")"

    if [[ -z "$pids" ]]; then
        echo "Porta $port: livre"
        return
    fi

    echo "Porta $port: em uso pelos PIDs: $(echo "$pids" | xargs)"
    echo "$pids" | xargs -r kill || true
    sleep 1

    local remaining
    remaining="$(pids_for_port "$port")"

    if [[ -n "$remaining" ]]; then
        echo "Porta $port: processos ainda ativos, forçando encerramento..."
        echo "$remaining" | xargs -r kill -9 || true
        sleep 1
    fi

    if [[ -n "$(pids_for_port "$port")" ]]; then
        echo "Erro: não foi possível liberar a porta $port." >&2
        exit 1
    fi

    echo "Porta $port: liberada"
}

echo "Verificando e liberando portas..."
for port in "${PORTS[@]}"; do
    kill_port_processes "$port"
done

echo "Iniciando projeto com npm run full..."
exec npm run full
