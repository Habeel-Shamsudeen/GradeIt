import Link from "next/link";
import { Button } from "@/app/_components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-6 p-8 text-center">
        <h1 className="text-9xl font-bold text-foreground">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="mx-auto max-w-md text-muted-foreground">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Button asChild className="bg-primary text-primary-foreground">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
