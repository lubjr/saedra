# API Service

REST API service for the Saedra platform with AWS Bedrock integration.

## Setup

### Prerequisites

- Node.js 20+
- pnpm
- AWS credentials configured

### AWS Configuration

Set up your AWS credentials using one of these methods:

**Option 1: Environment Variables**

Create a `.env` file in `apps/api/`:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

**Option 2: AWS Credentials File**

Configure `~/.aws/credentials`:

```ini
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Server runs on `http://localhost:3002`

## API Endpoints

### Health Check

```
GET /
```

Returns API status.

### Bedrock AI Chat

```
POST /bedrock/chat
```

Chat with AI models via AWS Bedrock.

**Request Body:**

```json
{
  "message": "Your question here",
  "modelId": "amazon.titan-text-express-v1"
}
```

**Parameters:**

- `message` (required): The user's message
- `modelId` (optional): Model to use. Default: `amazon.titan-text-express-v1`

**Available Models:**

| Model ID | Provider | Status | Cost |
|----------|----------|--------|------|
| `amazon.titan-text-express-v1` | Amazon | ✅ Pre-approved | $ |
| `amazon.titan-text-lite-v1` | Amazon | ✅ Pre-approved | $ (cheaper) |
| `anthropic.claude-3-haiku-20240307-v1:0` | Anthropic | 🔒 Requires approval | $$ |
| `anthropic.claude-3-sonnet-20240229-v1:0` | Anthropic | 🔒 Requires approval | $$$ |

**Response:**

```json
{
  "response": "AI generated response",
  "metadata": {
    "inputTokens": 10,
    "outputTokens": 50,
    "stopReason": "FINISH"
  }
}
```

**Example:**

```bash
curl -X POST http://localhost:3002/bedrock/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is AWS Bedrock?"
  }'
```

**Using a specific model:**

```bash
curl -X POST http://localhost:3002/bedrock/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain quantum computing",
    "modelId": "anthropic.claude-3-haiku-20240307-v1:0"
  }'
```

### List Available Models

```
GET /bedrock/models
```

Returns all available foundation models in AWS Bedrock.

**Response:**

```json
{
  "models": [
    {
      "modelId": "amazon.titan-text-express-v1",
      "modelName": "Titan Text G1 - Express",
      "provider": "Amazon",
      "inputModalities": ["TEXT"],
      "outputModalities": ["TEXT"]
    }
  ]
}
```

**Example:**

```bash
curl http://localhost:3002/bedrock/models
```

## Notes

- Amazon Titan models are usually pre-approved and ready to use
- Anthropic Claude models require requesting access in AWS Bedrock console
- After requesting access, approval typically takes a few minutes
- Check your AWS region - some models are only available in specific regions
