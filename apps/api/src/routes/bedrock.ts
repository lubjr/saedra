import { BedrockService } from "@repo/bedrock-service/bedrock";
import { Router } from "express";

export const bedrockRoutes = Router();

// Initialize Bedrock service
const bedrockService = new BedrockService({
  region: process.env.AWS_REGION || "us-east-1",
});

/**
 * POST /bedrock/chat
 * Simple chat endpoint using Claude via Bedrock
 *
 * Request body:
 * {
 *   "message": "Your question here",
 *   "modelId": "anthropic.claude-3-sonnet-20240229-v1:0" (optional)
 * }
 */
bedrockRoutes.post("/chat", async (req, res) => {
  try {
    const { message, modelId = "anthropic.claude-3-sonnet-20240229-v1:0" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await bedrockService.invokeWithMessages(modelId, {
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
    });

    res.json({
      response: response.completion,
      metadata: response.metadata,
    });
  } catch (error) {
    console.error("Bedrock chat error:", error);
    res.status(500).json({
      error: "Failed to process chat request",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /bedrock/models
 * List available Bedrock models
 */
bedrockRoutes.get("/models", async (_req, res) => {
  try {
    const models = await bedrockService.listModels();
    res.json({ models });
  } catch (error) {
    console.error("Failed to list models:", error);
    res.status(500).json({
      error: "Failed to list models",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
