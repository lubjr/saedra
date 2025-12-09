# Bedrock Service

Package para integração com AWS Bedrock.

## Configuração Inicial

Este package fornece uma estrutura básica para trabalhar com AWS Bedrock, incluindo:

- Cliente configurado para Bedrock Runtime
- Tipos TypeScript para requisições e respostas
- Métodos base para invocar modelos

## Uso Básico

```typescript
import { BedrockService } from "@repo/bedrock-service/bedrock";

// Inicializar o serviço
const bedrock = new BedrockService({
  region: "us-east-1",
  // Opcionalmente, fornecer credenciais
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY",
    secretAccessKey: "YOUR_SECRET_KEY",
  },
});

// Listar modelos disponíveis
const models = await bedrock.listModels();

// Invocar um modelo
const response = await bedrock.invokeModel("anthropic.claude-v2", {
  prompt: "Olá, como você está?",
  config: {
    temperature: 0.7,
    maxTokens: 1000,
  },
});
```

## Configuração AWS

Certifique-se de ter:
- Credenciais AWS configuradas (via variáveis de ambiente, arquivo de credenciais ou IAM Role)
- Permissões necessárias para Bedrock (bedrock:InvokeModel, bedrock:ListFoundationModels)
- Região AWS que suporta Bedrock

## Próximos Passos

Este é um setup inicial. Você pode estender com:
- Suporte específico para diferentes providers (Claude, Llama, etc.)
- Streaming de respostas
- Embeddings
- Gestão de contexto e histórico
- Rate limiting e retry logic
