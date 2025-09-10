import { Button } from "@repo/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 mt-8">
      <h1 className="font-semibold text-xl">404</h1>
      <h2 className="text-xl font-semibold mb-2">Page not found</h2>
      <p className="text-muted-foreground mb-6 max-w-md text-sm">
        Oops! The page you’re looking for doesn’t exist or you don’t have
        permission to access it.
      </p>
      <Button asChild className="mt-4">
        <a href="/">Go back home</a>
      </Button>
    </div>
  );
}
