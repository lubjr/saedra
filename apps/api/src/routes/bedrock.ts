import { BedrockService } from "@repo/bedrock-service/bedrock";
import { Router, type Router as RouterType } from "express";
import rateLimit from "express-rate-limit";

export const bedrockRoutes: RouterType = Router();

const bedrockService = new BedrockService({
  region: process.env.AWS_REGION || "us-east-1",
});

// Rate limiting para proteger contra abuso nas rotas de IA
// Limite: 20 requisições por minuto por IP
const bedrockLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20, // limite de 20 requisições por janela
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "1 minute",
  },
  standardHeaders: true, // Retorna informações de rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
});

// Aplica rate limiting em todas as rotas do Bedrock
bedrockRoutes.use(bedrockLimiter);

bedrockRoutes.post("/chat", async (req, res) => {
  try {
    const { message, modelId = "amazon.titan-text-express-v1" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const isAnthropicModel = modelId.startsWith("anthropic.");
    const isTitanModel = modelId.startsWith("amazon.titan");

    const response = isAnthropicModel
      ? await bedrockService.invokeWithMessages(modelId, {
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
          config: {
            maxTokens: 1000,
            temperature: 0.7,
          },
        })
      : await bedrockService.invokeModel(modelId, {
          prompt: isTitanModel
            ? message
            : `\n\nHuman: ${message}\n\nAssistant:`,
          config: {
            maxTokens: 1000,
            temperature: 0.7,
          },
        });

    res.json({
      response: response.completion,
      metadata: response.metadata,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to process chat request",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

bedrockRoutes.get("/models", async (_req, res) => {
  try {
    const models = await bedrockService.listModels();
    res.json({ models });
  } catch (error) {
    res.status(500).json({
      error: "Failed to list models",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
