"use client";

import * as React from "react";

const BreadcrumbContext = React.createContext<{
  label: string | null;
  setLabel: (label: string | null) => void;
}>({
  label: null,
  setLabel: () => {},
});

export const BreadcrumbProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [label, setLabel] = React.useState<string | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ label, setLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBreadcrumbLabel = () => {
  return React.useContext(BreadcrumbContext);
};
