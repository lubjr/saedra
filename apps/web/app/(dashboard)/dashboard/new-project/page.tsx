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
    <div className="flex flex-col">
      <div className="mx-auto max-w-6xl w-full space-y-6 px-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight py-2">
            Create project
          </h1>
          <p className="text-muted-foreground">
            Create a new project to get started
          </p>
        </div>

        <div className="flex gap-2 max-w-md bg-zinc-900">
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
    </div>
  );
}
