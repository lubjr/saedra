import { EventEmitter } from "node:events";

export type ResourceEvent = {
  type: "invalidate";
  resource: string;
};

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

export const subscribeToUserEvents = (
  userId: string,
  listener: (event: ResourceEvent) => void,
): (() => void) => {
  emitter.on(userId, listener);
  return () => {
    emitter.off(userId, listener);
  };
};

export const publishInvalidate = (userId: string, resource: string): void => {
  const event: ResourceEvent = { type: "invalidate", resource };
  emitter.emit(userId, event);

  const webAppUrl = process.env.WEB_APP_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!webAppUrl || !secret) {
    return;
  }

  fetch(`${webAppUrl}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-revalidate-secret": secret,
    },
    body: JSON.stringify({ resource }),
  }).catch((error) => {
    console.error(
      "failed to call revalidate webhook:",
      error instanceof Error ? error.message : error,
    );
  });
};
