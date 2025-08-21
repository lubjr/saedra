"use client";

import {
  broker as natsBroker,
  codec as natsCodec,
  connectClient,
} from "@repo/nats-client/browser";
import * as React from "react";

type NatsContextType = {
  broker: typeof natsBroker;
  codec: typeof natsCodec;
};

const NatsContext = React.createContext<NatsContextType | null>(null);

export const NatsProvider = ({ children }: { children: React.ReactNode }) => {
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    connectClient()
      .then(() => {
        return setConnected(true);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        return console.error("NATS connect failed:", error);
      });
  }, []);

  if (!connected) {
    return;
  }

  return (
    <NatsContext.Provider value={{ broker: natsBroker, codec: natsCodec }}>
      {children}
    </NatsContext.Provider>
  );
};

export const useNats = () => {
  const context = React.useContext(NatsContext);
  if (!context) throw new Error("useNats must be used within a NatsProvider");
  return context;
};
