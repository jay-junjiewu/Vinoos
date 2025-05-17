
"use client";

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const hookIsMobile = useIsMobile();

  const [isClient, setIsClient] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerMobileVisible, setHeaderMobileVisible] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isMobile = isClient ? hookIsMobile : false;

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrolled(currentScrollY > 20);

    if (isMobile) {
      if (currentScrollY < 10) {
        setHeaderMobileVisible(true);
      } else {
        if (currentScrollY > lastScrollY && currentScrollY > 50) { 
            setHeaderMobileVisible(false);
        } else if (currentScrollY < lastScrollY) { 
          setHeaderMobileVisible(true);
        }
      }
      setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY); 
    } else {
      setHeaderMobileVisible(true); 
    }
  }, [isMobile, lastScrollY, setScrolled, setHeaderMobileVisible, setLastScrollY]);

  useEffect(() => {
    if (!isClient) return;

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isClient, handleScroll]);

  useEffect(() => {
    if (!isClient) return;
    setMobileMenuOpen(false);
  }, [pathname, isClient]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 transform",
        "transition-transform transition-colors transition-shadow duration-1000 ease-in-out",
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-lg"
          : "bg-background shadow-md",
        isMobile && !headerMobileVisible ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6 pl-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Vinoos Home">
            <span className={cn("font-bold text-xl text-primary transition-opacity duration-300 hover:opacity-80")}>Vinoos</span>
          </Link>
          
          {!isMobile && (
            <nav className="hidden md:flex gap-5 items-center">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href + '/') && link.href !== '/') || (link.href.includes('#') && pathname === link.href.split('#')[0]);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive
                        ? (link.label === 'Contact Us'
                            ? "text-primary font-semibold" // Active Contact Us: no underline
                            : "text-primary font-semibold underline underline-offset-4") // Active other links
                        : (link.label === 'Contact Us'
                            ? "text-foreground/80 hover:text-primary" // Inactive Contact Us: no hover underline
                            : "text-foreground/80 hover:text-primary hover:underline hover:underline-offset-4") // Inactive other links
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
                  className={cn("transition-colors text-primary hover:bg-primary/10 h-10 w-10")}
                  aria-label="Toggle Menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full h-full p-6 bg-background"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <Link 
                  href="/" 
                  className="flex items-center gap-2 mb-8" 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Vinoos Home"
                >
                  <span className="font-bold text-xl text-primary">Vinoos</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-xl font-medium transition-colors hover:text-primary",
                        (pathname === link.href || (pathname.startsWith(link.href + '/') && link.href !== '/') || (link.href.includes('#') && pathname === link.href.split('#')[0])) ? "text-primary font-semibold" : "text-foreground"
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
