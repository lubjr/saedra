import type { NextFunction, Request, Response } from "express";

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

/**
 * Returns color based on HTTP status code
 */
const getStatusColor = (statusCode: number): string => {
  if (statusCode >= 500) return colors.red;
  if (statusCode >= 400) return colors.yellow;
  if (statusCode >= 300) return colors.blue;
  if (statusCode >= 200) return colors.green;
  return colors.reset;
};

/**
 * Formats duration with appropriate unit and color
 */
const formatDuration = (ms: number): string => {
  if (ms < 1000) {
    return `${colors.dim}${ms}ms${colors.reset}`;
  }
  return `${colors.bright}${(ms / 1000).toFixed(2)}s${colors.reset}`;
};

/**
 * Formats timestamp in readable format
 */
const getTimestamp = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${colors.gray}[${hours}:${minutes}:${seconds}]${colors.reset}`;
};

/**
 * Request logging middleware
 * Logs HTTP method, path, status code, and response time with colors
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusColor = getStatusColor(res.statusCode);
    const timestamp = getTimestamp();

    const method = `${colors.cyan}${req.method.padEnd(7)}${colors.reset}`;

    const status = `${statusColor}${res.statusCode}${colors.reset}`;

    const time = formatDuration(duration);

    // eslint-disable-next-line no-console
    console.log(`${timestamp} ${method} ${req.path} → ${status} ${time}`);
  });

  next();
};
