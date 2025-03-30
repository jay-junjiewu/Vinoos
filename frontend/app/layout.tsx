import type React from "react"
import "./globals.css"
import Link from "next/link"
import { Mountain } from "lucide-react"

import { ThemeProvider } from "@/components/theme-provider"
import MobileNav from "@/components/mobile-nav"

export const metadata = {
  title: "Aquatic Designs | Custom Fish Tank Design & Manufacturing",
  description:
    "Professional custom fish tank design, manufacturing, and installation services for residential and commercial properties.",
    generator: 'v0.dev'
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth light" style={{colorScheme: "light"}}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="fish tanks, aquariums, custom aquariums, aquatic design, fish tank installation"
        />
        <meta property="og:title" content="Aquatic Designs | Custom Fish Tank Design & Manufacturing" />
        <meta
          property="og:description"
          content="Professional custom fish tank design, manufacturing, and installation services for residential and commercial properties."
        />
        <meta property="og:type" content="website" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 sm:h-16 items-center">
                <div className="mr-4 flex">
                  <Link className="mr-6 flex items-center space-x-2" href="/">
                    <Mountain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    <span className="hidden font-bold sm:inline-block">Aquatic Designs</span>
                  </Link>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
                  <nav className="hidden md:flex items-center space-x-4">
                    <Link href="/" className="text-sm font-medium transition-colors hover:text-blue-600">
                      Home
                    </Link>
                    <Link href="/projects" className="text-sm font-medium transition-colors hover:text-blue-600">
                      Projects
                    </Link>
                    <Link href="/equipment" className="text-sm font-medium transition-colors hover:text-blue-600">
                      Equipment
                    </Link>
                    <Link href="/contact" className="text-sm font-medium transition-colors hover:text-blue-600">
                      Contact
                    </Link>
                  </nav>
                  <MobileNav />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t bg-muted">
              <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Mountain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    <span className="font-bold">Aquatic Designs</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Custom aquarium design and manufacturing since 2005.
                  </p>
                </div>
                <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-4">
                  <Link href="/projects" className="text-sm hover:underline">
                    Projects
                  </Link>
                  <Link href="/equipment" className="text-sm hover:underline">
                    Equipment
                  </Link>
                  <Link href="/contact" className="text-sm hover:underline">
                    Contact
                  </Link>
                  <Link href="/privacy" className="text-sm hover:underline">
                    Privacy
                  </Link>
                  <Link href="/terms" className="text-sm hover:underline">
                    Terms
                  </Link>
                </nav>
              </div>
              <div className="container py-4 text-center text-sm text-muted-foreground border-t">
                © {new Date().getFullYear()} Aquatic Designs Inc. All rights reserved.
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'