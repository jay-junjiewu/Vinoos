"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] sm:w-[350px] pt-10">
        <nav className="flex flex-col gap-6">
          <Link
            href="/"
            className="text-lg font-medium transition-colors hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="text-lg font-medium transition-colors hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Projects
          </Link>
          <Link
            href="/equipment"
            className="text-lg font-medium transition-colors hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Equipment
          </Link>
          <Link
            href="/contact"
            className="text-lg font-medium transition-colors hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

