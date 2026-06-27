import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">
        404
      </p>
      <h1 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
        The page you are looking for doesn’t exist or may have moved. Explore our
        custom fish tanks, acrylic work and cabinets instead.
      </p>
      <div className="mt-8 flex justify-center">
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
      <nav aria-label="Site pages" className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
