
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPinIcon, Phone, Instagram, Facebook } from 'lucide-react';
import { BUSINESS_INFO, FISH_TANK_PROJECTS_DATA } from '@/lib/constants';
import { ProjectCard } from '@/components/showcase/ProjectCard';
import { AutoScrollingHero } from '@/components/showcase/AutoScrollingHero';

export default function HomePage() {
  const featuredProjects = FISH_TANK_PROJECTS_DATA.slice(0, 4); // Show 4 featured projects

  return (
    <div className="flex flex-col">
      <AutoScrollingHero />

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center text-primary">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"> {/* Updated grid to accommodate 4 projects */}
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            {FISH_TANK_PROJECTS_DATA.length > featuredProjects.length && (
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
      <section id="contact" className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-primary">
            Visit or Contact Us
          </h2>
          <Card className="max-w-3xl mx-auto shadow-xl border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-center md:text-left text-primary">{BUSINESS_INFO.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 sm:space-y-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                
                {/* Left Column: Stacked Location and Hours */}
                <div className="flex flex-col gap-3 md:gap-4"> {/* Reduced gap here */}
                  {/* Location Box */}
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Our Location</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <MapPinIcon className="h-5 w-5 text-accent mt-1 shrink-0" />
                        <a href={BUSINESS_INFO.googleMapsLink} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                          {BUSINESS_INFO.address}
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Business Hours Box */}
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Business Hours</h3>
                    <ul className="space-y-1.5 text-muted-foreground">
                      {BUSINESS_INFO.hours.map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column: Contact Details Box */}
                <div className="rounded-lg border bg-card p-6 h-full">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Contact Details</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-accent" />
                      <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-accent transition-colors">{BUSINESS_INFO.phone}</a>
                    </li>
                    <li className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-accent" />
                      <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-accent transition-colors">{BUSINESS_INFO.email}</a>
                    </li>
                    {BUSINESS_INFO.instagramUrl && BUSINESS_INFO.instagramHandle && (
                      <li className="flex items-center gap-3">
                        <Instagram className="h-5 w-5 text-accent" />
                        <a href={BUSINESS_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                          {BUSINESS_INFO.instagramHandle}
                        </a>
                      </li>
                    )}
                    {BUSINESS_INFO.facebookUrl && BUSINESS_INFO.facebookHandle && (
                     <li className="flex items-center gap-3">
                        <Facebook className="h-5 w-5 text-accent" />
                        <a href={BUSINESS_INFO.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                          {BUSINESS_INFO.facebookHandle}
                        </a>
                      </li>
                    )}
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
