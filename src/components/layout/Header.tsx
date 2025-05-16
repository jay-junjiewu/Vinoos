
"use client";

import Link from 'next/link';
import { Menu } from 'lucide-react'; // Removed Fish import
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const hookIsMobile = useIsMobile();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    // Close mobile menu on path change
    setMobileMenuOpen(false);
  }, [pathname, isClient]);

  const isMobile = isClient ? hookIsMobile : false;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out border-b border-border/40",
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-lg"
          : "bg-background shadow-md" // Consistent background and shadow
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6 pl-4"> {/* Added pl-4 for left padding */}
          <Link href="/" className="flex items-center gap-2" aria-label="Vinoos Home">
            <span className={cn("font-bold text-xl text-primary transition-opacity duration-300 hover:opacity-80")}>Vinoos</span>
          </Link>
          
          {!isMobile && (
            <nav className="hidden md:flex gap-5 items-center"> {/* Adjusted gap for nav links */}
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary font-semibold underline underline-offset-4" // Active: primary color, bold, underlined
                        : "text-foreground/80 hover:text-primary hover:underline hover:underline-offset-4" // Inactive: slightly muted, hover to primary & underline
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {isMobile && (
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setMobileMenuOpen(true)} 
                  className={cn("transition-colors text-primary hover:bg-primary/10 h-10 w-10")} // Consistent icon color & size
                  aria-label="Toggle Menu"
                >
                  <Menu className="h-8 w-8" /> {/* Increased size */}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full h-full p-6 bg-background" // Full page mobile menu
              >
                <Link 
                  href="/" 
                  className="flex items-center gap-2 mb-8" 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Vinoos Home"
                >
                  {/* Fish icon removed here */}
                  <span className="font-bold text-xl text-primary">Vinoos</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-xl font-medium transition-colors hover:text-primary", // Increased font size
                        pathname === link.href ? "text-primary font-semibold" : "text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
}
