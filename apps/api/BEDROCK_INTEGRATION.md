# Bedrock Service Integration

## Endpoints Disponíveis

### POST /bedrock/chat
Endpoint para chat simples usando Claude via AWS Bedrock.

**Request:**
```json
{
  "message": "Sua pergunta aqui",
  "modelId": "anthropic.claude-3-sonnet-20240229-v1:0" // opcional
}
```

**Response:**
```json
{
  "response": "Resposta do modelo",
  "metadata": {
    "inputTokens": 10,
    "outputTokens": 50,
    "stopReason": "end_turn"
  }
}
```

**Exemplo de uso:**
```bash
curl -X POST http://localhost:3002/bedrock/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Olá, como você está?"
  }'
```

### GET /bedrock/models
Lista todos os modelos disponíveis no AWS Bedrock.

**Response:**
```json
{
  "models": [
    {
      "modelId": "anthropic.claude-3-sonnet-20240229-v1:0",
      "modelName": "Claude 3 Sonnet",
      "provider": "Anthropic",
      "inputModalities": ["TEXT"],
      "outputModalities": ["TEXT"]
    }
  ]
}
```

**Exemplo de uso:**
```bash
curl http://localhost:3002/bedrock/models
```

## Configuração

O serviço usa as credenciais AWS configuradas no ambiente:
- `AWS_REGION` (default: us-east-1)
- Credenciais AWS via environment variables ou AWS credentials file

## Arquivos Modificados

- `apps/api/package.json` - Adicionada dependência `@repo/bedrock-service`
- `apps/api/src/routes/bedrock.ts` - Novas rotas do Bedrock
- `apps/api/src/index.ts` - Integração das rotas
