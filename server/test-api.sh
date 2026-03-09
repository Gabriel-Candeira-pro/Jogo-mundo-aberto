#!/bin/bash

# Script de Teste da API Gayme
# Testa todos os endpoints principais

BASE_URL="http://localhost:3000"
USERNAME="teste_$(date +%s)"
PASSWORD="senha123"
TOKEN=""

echo "🎮 Testando API Gayme"
echo "===================="
echo ""

# Função para printar resultados
print_result() {
    if [ $1 -eq 0 ]; then
        echo "✅ $2"
    else
        echo "❌ $2"
    fi
}

# 1. Health Check
echo "1️⃣ Testando Health Check..."
response=$(curl -s -w "%{http_code}" -o /dev/null ${BASE_URL}/api/health)
if [ "$response" = "200" ]; then
    print_result 0 "Servidor está online"
else
    print_result 1 "Servidor offline (código: $response)"
    exit 1
fi
echo ""

# 2. Registro
echo "2️⃣ Testando Registro..."
register_response=$(curl -s -X POST ${BASE_URL}/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"${USERNAME}\",\"password\":\"${PASSWORD}\"}")

TOKEN=$(echo $register_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    print_result 0 "Registro bem-sucedido"
    echo "   Token: ${TOKEN:0:20}..."
else
    print_result 1 "Falha no registro"
    echo "   Response: $register_response"
fi
echo ""

# 3. Login
echo "3️⃣ Testando Login..."
login_response=$(curl -s -X POST ${BASE_URL}/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"${USERNAME}\",\"password\":\"${PASSWORD}\"}")

NEW_TOKEN=$(echo $login_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$NEW_TOKEN" ]; then
    print_result 0 "Login bem-sucedido"
    TOKEN=$NEW_TOKEN
else
    print_result 1 "Falha no login"
fi
echo ""

# 4. Verificar Token
echo "4️⃣ Testando Verificação de Token..."
verify_response=$(curl -s -w "%{http_code}" -o /dev/null \
    -H "Authorization: Bearer ${TOKEN}" \
    ${BASE_URL}/api/auth/verify)

if [ "$verify_response" = "200" ]; then
    print_result 0 "Token válido"
else
    print_result 1 "Token inválido"
fi
echo ""

# 5. Salvar Personagem
echo "5️⃣ Testando Salvar Personagem..."
char_save=$(curl -s -X POST ${BASE_URL}/api/character \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"name":"Herói Teste","level":5,"speed":200}')

if echo "$char_save" | grep -q "success"; then
    print_result 0 "Personagem salvo"
else
    print_result 1 "Falha ao salvar personagem"
fi
echo ""

# 6. Carregar Personagem
echo "6️⃣ Testando Carregar Personagem..."
char_load=$(curl -s -H "Authorization: Bearer ${TOKEN}" \
    ${BASE_URL}/api/character)

if echo "$char_load" | grep -q "Herói Teste"; then
    print_result 0 "Personagem carregado"
else
    print_result 1 "Falha ao carregar personagem"
fi
echo ""

# 7. Salvar Usuário
echo "7️⃣ Testando Salvar Dados do Usuário..."
user_save=$(curl -s -X POST ${BASE_URL}/api/user \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"highScore":1000,"gamesPlayed":10}')

if echo "$user_save" | grep -q "success"; then
    print_result 0 "Dados do usuário salvos"
else
    print_result 1 "Falha ao salvar dados"
fi
echo ""

# 8. Exportar Dados
echo "8️⃣ Testando Exportar Dados..."
export_data=$(curl -s -H "Authorization: Bearer ${TOKEN}" \
    ${BASE_URL}/api/export)

if echo "$export_data" | grep -q "exportDate"; then
    print_result 0 "Dados exportados"
else
    print_result 1 "Falha ao exportar"
fi
echo ""

# Resumo
echo ""
echo "===================="
echo "✅ Testes Concluídos"
echo "===================="
echo ""
echo "Usuário criado: ${USERNAME}"
echo "Token: ${TOKEN:0:30}..."
echo ""
echo "💡 Para testar manualmente:"
echo "   export TOKEN=\"${TOKEN}\""
echo "   curl -H \"Authorization: Bearer \$TOKEN\" ${BASE_URL}/api/character"
echo ""
