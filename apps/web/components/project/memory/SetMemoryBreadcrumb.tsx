"use client";

import * as React from "react";

import { useBreadcrumbLabel } from "../../../app/contexts/BreadcrumbContext";

interface Props {
  label: string | null;
}

export const SetMemoryBreadcrumb = ({ label }: Props) => {
  const { setLabel } = useBreadcrumbLabel();

  React.useEffect(() => {
    setLabel(label);
    return () => {
      setLabel(null);
    };
  }, [label, setLabel]);

  return null;
};
