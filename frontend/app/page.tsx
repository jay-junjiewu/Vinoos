import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import FeaturedTanks from "@/components/featured-tanks"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none">
                  Custom Aquatic Environments For Your Space
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-sm sm:text-base md:text-lg">
                  Designing and manufacturing premium fish tanks that bring life and tranquility to any setting.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/projects">
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    View Our Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center mt-6 lg:mt-0">
              <div className="relative h-[250px] w-full sm:h-[300px] lg:h-[400px] lg:w-[400px] xl:h-[500px] xl:w-[500px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  fill
                  alt="Elegant custom fish tank in a modern living room"
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full py-8 md:py-16 lg:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-800">
                About Our Company
              </div>
              <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">
                Crafting Aquatic Masterpieces Since 2005
              </h2>
              <p className="max-w-[700px] text-muted-foreground text-sm sm:text-base">
                We specialize in designing and building custom fish tanks that blend seamlessly with your space. From
                small home aquariums to large commercial installations, our expert team handles every detail.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 mt-8">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 sm:p-6 bg-blue-50">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600"
                  >
                    <path d="M20.283 10.356h-8.327a2 2 0 0 0-1.732 1.01L9.293 12.5l.035.047a2 2 0 0 0 1.732 1.001h8.054a2 2 0 0 0 1.866-1.284l.734-1.819a1.012 1.012 0 0 0 .033-.904 1.03 1.03 0 0 0-.666-.683 1.025 1.025 0 0 0-.424-.08 1.111 1.111 0 0 0-.374.066Z" />
                    <path d="M11.05 2.433a2.074 2.074 0 0 1 1.905 1.265l.365.949 1.13 2.954a2.074 2.074 0 0 1-1.905 2.876H7.87a2.074 2.074 0 0 1-1.904-2.878l1.063-2.954.395-.947a2.074 2.074 0 0 1 1.905-1.265h1.723Z" />
                    <path d="M11 16.01V21" />
                    <path d="M7 16.01V21" />
                    <path d="M15 16.01V21" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold">Custom Design</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Every tank is tailored to fit your specific space and aesthetic preferences.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 sm:p-6 bg-blue-50">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600"
                  >
                    <path d="M3 9h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="M3 9V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3" />
                    <path d="M9 14v1" />
                    <path d="M15 14v1" />
                    <path d="M12 14v1" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold">Expert Installation</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Professional setup with cutting-edge filtration, lighting, and maintenance systems.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 sm:p-6 bg-blue-50">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold">Ongoing Support</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Comprehensive maintenance services to keep your aquatic system thriving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="w-full py-8 md:py-16 lg:py-24 bg-blue-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">Featured Projects</h2>
              <p className="max-w-[700px] text-muted-foreground text-sm sm:text-base">
                Explore some of our most impressive custom fish tank installations
              </p>
            </div>
            <FeaturedTanks />
            <div className="flex justify-center mt-8">
              <Link href="/projects">
                <Button variant="outline" className="rounded-full">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="w-full py-8 md:py-16 lg:py-24 bg-blue-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">Ready to Transform Your Space?</h2>
              <p className="max-w-[700px] text-blue-100 text-sm sm:text-base">
                Contact us today to discuss your custom fish tank project. We'll guide you through every step of the
                process.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
              <Link href="/contact">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline" className="text-white border-white hover:bg-blue-700 w-full sm:w-auto">
                  Frequently Asked Questions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Info */}
      <section className="w-full py-6 sm:py-8 bg-blue-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm">(555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm">info@aquaticdesigns.com</span>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-2">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm">123 Main Street, Anytown, USA</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

