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
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-lg border border-zinc-700">
            v1.4
          </span>
        </div>

        <Menu />

        <ButtonPanel />
      </nav>
    </header>
  );
};
