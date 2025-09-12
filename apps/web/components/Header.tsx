import { Badge } from "@repo/ui/badge";
import Link from "next/link";

import { ButtonPanel } from "./AcessPanel";
import { Menu } from "./Menu";

export const Header = () => {
  return (
    <header className="bg-zinc-900 py-4">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            className="text-white text-xl font-bold tracking-tight"
          >
            Saedra
          </Link>
          <Badge variant="outline">v1.5</Badge>
        </div>

        <Menu />

        <ButtonPanel />
      </nav>
    </header>
  );
};
