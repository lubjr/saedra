import { Router } from "express";

import { subscribeToUserEvents } from "./events.js";
import { authenticate } from "./middleware/authenticate.js";

const routes: Router = Router();

const HEARTBEAT_INTERVAL_MS = 25_000;

routes.get("/", authenticate, (req, res) => {
  const userId = req.user.id;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });
  res.write("retry: 5000\n\n");

  const unsubscribe = subscribeToUserEvents(userId, (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, HEARTBEAT_INTERVAL_MS);

  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});

export default routes;
