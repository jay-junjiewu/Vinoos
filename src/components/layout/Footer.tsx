export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 bg-background">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AquaCraft Showcase. All rights reserved.</p>
        <p className="mt-1">Designed by an expert fishkeeping enthusiast.</p>
      </div>
    </footer>
  );
}
