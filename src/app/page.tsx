
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPinIcon, Phone } from 'lucide-react';
import { BUSINESS_INFO, PROJECTS_DATA } from '@/lib/constants';
import { ProjectCard } from '@/components/showcase/ProjectCard';

export default function HomePage() {
  const featuredProjects = PROJECTS_DATA.slice(0, 2); // Get the first two projects

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary to-blue-700 text-primary-foreground">
        <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('https://picsum.photos/seed/hero/1920/1080')" }}
            data-ai-hint="underwater bubbles"
          ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-md">
            Welcome to AquaCraft Showcase
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-sm">
            Discover stunning custom fish tank builds and top-quality aquarium equipment.
            Let us bring your aquatic vision to life.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
              <Link href="/projects">View Projects</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 shadow-lg">
              <Link href="/equipment">Shop Equipment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-10 text-center text-primary">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            {PROJECTS_DATA.length > 2 && (
               <div className="mt-12 text-center">
                <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-accent-foreground shadow-md">
                  <Link href="/projects">View All Projects</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Business Information Section */}
      <section id="contact" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-10 text-primary">
            Visit or Contact Us
          </h2>
          <Card className="max-w-3xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">{BUSINESS_INFO.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Business Hours</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    {BUSINESS_INFO.hours.map((item) => (
                      <li key={item.day} className="flex justify-between">
                        <span>{item.day}:</span>
                        <span>{item.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Contact Details</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-accent" />
                      <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-accent">{BUSINESS_INFO.phone}</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-accent" />
                      <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-accent">{BUSINESS_INFO.email}</a>
                    </li>
                    <li className="flex items-start gap-2">
                      <MapPinIcon className="h-5 w-5 text-accent mt-1" />
                      <a href={BUSINESS_INFO.googleMapsLink} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                        {BUSINESS_INFO.address}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
