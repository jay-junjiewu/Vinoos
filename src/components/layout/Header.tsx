
"use client";

import Link from 'next/link';
import { Fish, Menu } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out border-b border-border/40",
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-lg"
          : "bg-background shadow-md"
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2" aria-label="AquaCraft Showcase Home">
            <Fish className={cn("h-8 w-8 text-primary transition-transform duration-300 hover:scale-110")} />
            <span className={cn("font-bold text-xl text-primary transition-opacity duration-300 hover:opacity-80")}>AquaCraft</span>
          </Link>
          
          <nav className="hidden md:flex gap-5 items-center">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive
                      ? "text-primary font-semibold underline underline-offset-4"
                      : "text-foreground/80 hover:underline hover:underline-offset-4"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(true)} 
                className={cn("transition-colors text-primary hover:bg-primary/10")}
                aria-label="Toggle Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6 bg-background">
              <Link 
                href="/" 
                className="flex items-center gap-2 mb-8" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="AquaCraft Showcase Home"
              >
                <Fish className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl text-primary">AquaCraft</span>
              </Link>
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
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
      </div>
    </header>
  );
}
