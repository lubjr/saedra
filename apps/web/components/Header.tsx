import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import Link from "next/link";

import { Menu } from "./Menu";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900 py-4 border-b border-zinc-800">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            className="text-white text-xl font-bold tracking-tight"
          >
            Saedra
          </Link>
          <Badge variant="outline">v2.0</Badge>
        </div>

        <Menu />

        <Link href="/login" className="mr-4">
          <Button variant="outline">Login</Button>
        </Link>
      </nav>
    </header>
  );
};
