"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import * as React from "react";

import { useProjects } from "../../../contexts/ProjectsContext";

export default function Page() {
  const { create } = useProjects();
  const [name, setName] = React.useState("");

  const handleSubmit = async () => {
    if (!name) return;
    await create({ name });
    setName("");
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          placeholder="Your Project Name"
          value={name}
          onChange={(e) => {
            return setName(e.target.value);
          }}
        />
        <Button onClick={handleSubmit}>Create</Button>
      </div>
    </div>
  );
}
