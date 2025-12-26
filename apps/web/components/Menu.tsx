"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@repo/ui/navigation-menu";

export const Menu = () => {
  const links = [
    { href: "#docs", label: "Docs" },
    { href: "#blog", label: "Blog" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "About" },
  ];

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.history.pushState({}, "", href);
    }

    e.currentTarget.blur();
  };

  return (
    <div className="flex items-center gap-4">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {links.map(({ href, label }) => {
            return (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild>
                  <a
                    href={href}
                    className={`${navigationMenuTriggerStyle()} bg-zinc-900`}
                    onClick={(e) => {
                      return handleScrollTo(e, href);
                    }}
                  >
                    {label}
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
      <a
        href="https://github.com/lubjr/saedra"
        target="_blank"
        rel="noopener noreferrer"
        className="text-zinc-300 hover:text-white transition"
        aria-label="GitHub Repository"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <title>GitHub</title>
          <path d="M12 0C5.37 0 0 5.373 0 12a12 12 0 008.208 11.436c.6.112.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.388-1.332-1.757-1.332-1.757-1.09-.745.083-.73.083-.73 1.205.086 1.84 1.237 1.84 1.237 1.07 1.833 2.807 1.303 3.492.996.108-.774.418-1.304.76-1.604-2.665-.3-5.466-1.335-5.466-5.933 0-1.31.47-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.323 3.3 1.23a11.47 11.47 0 016.003 0c2.29-1.553 3.297-1.23 3.297-1.23.654 1.653.243 2.873.12 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.805 5.628-5.476 5.923.43.37.814 1.102.814 2.222v3.293c0 .32.218.694.825.576A12.005 12.005 0 0024 12c0-6.627-5.373-12-12-12z" />{" "}
        </svg>
      </a>
    </div>
  );
};
