import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Star, BookOpen, Sparkles, Target } from "lucide-react";
import { getVenues } from "@/lib/firestore";

export default function About() {
  const [, setLocation] = useLocation();

  const { data: venues = [] } = useQuery({
    queryKey: ["venues"],
    queryFn: getVenues,
  });

  const venueCount = venues.length;
  const cityCount = new Set(venues.map((v) => `${v.city}, ${v.state}`)).size;
  const stateCount = new Set(venues.map((v) => v.state)).size;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              About BowlingAlleys.io
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your trusted guide to discovering the perfect bowling experience across the United States
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-muted-foreground text-center mb-8">
              At BowlingAlleys.io, we're on a mission to end bowling information secrecy. It's 2025—no one should 
              have to call a bowling alley just to find out basic pricing, hours, or whether they offer cosmic bowling. 
              We believe bowling information should be transparent, accessible, and available at your fingertips.
            </p>
            <p className="text-lg text-muted-foreground text-center mb-12">
              Whether you're a competitive league bowler, planning a birthday party, looking for cosmic bowling fun, 
              or just want to enjoy a casual game with friends, we make it easy to find exactly what you're looking for—without 
              the frustration of endless phone calls and outdated websites.
            </p>
          </div>

          {/* What We Offer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Comprehensive Directory</h3>
                  <p className="text-muted-foreground">
                    Access detailed information about bowling alleys across 100+ cities nationwide, 
                    including addresses, hours, pricing, and amenities.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Real User Reviews</h3>
                  <p className="text-muted-foreground">
                    Read authentic reviews and ratings from fellow bowlers to help you make informed 
                    decisions about where to bowl.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Specialized Experiences</h3>
                  <p className="text-muted-foreground">
                    Find venues perfect for cosmic bowling, birthday parties, arcade gaming, 
                    dining experiences, and competitive leagues.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Educational Resources</h3>
                  <p className="text-muted-foreground">
                    Learn about bowling history, different types of bowling, improve your technique, 
                    and master scoring through our comprehensive guides.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Price Transparency</h3>
                  <p className="text-muted-foreground">
                    No more calling for prices. Compare rates across venues instantly—from per-game costs to 
                    shoe rentals. We're bringing bowling pricing out of the dark ages and into the digital age.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Community-Driven</h3>
                  <p className="text-muted-foreground">
                    Built by bowlers, for bowlers. Our platform grows with contributions and feedback 
                    from the bowling community.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                BowlingAlleys.io was born from a simple frustration: finding quality bowling alleys with 
                accurate, up-to-date information was harder than it should be. Too many bowling alleys hide 
                their pricing behind "call for details" or have outdated websites with no useful information. 
                In an era where you can order anything online with a few taps, why should finding bowling 
                information require detective work and phone calls?
              </p>
              <p>
                We set out to change that. Our platform brings together comprehensive venue information, 
                real user reviews, transparent pricing data, and specialized filters to help you find exactly what you're 
                looking for—all without picking up the phone. From traditional ten-pin bowling to specialty formats like 
                duckpin and candlepin, from casual family outings to competitive league play, we've got you covered. 
                Because bowling information should be as accessible as ordering a pizza.
              </p>
              <p>
                Today, BowlingAlleys.io serves bowlers across the United States with information about 
                thousands of bowling centers. We're constantly expanding our coverage and adding new features 
                to make your bowling experience even better.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Nationwide Coverage</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We cover bowling alleys in over 100 cities across the United States, with detailed city hub pages 
              providing localized information, top-rated venues, and community insights. Our coverage includes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6">
                <h3 className="text-4xl font-bold text-primary mb-2">
                  {cityCount > 0 ? `${cityCount}+` : '100+'}
                </h3>
                <p className="text-muted-foreground">Cities Covered</p>
              </div>
              <div className="p-6">
                <h3 className="text-4xl font-bold text-primary mb-2">
                  {venueCount > 0 ? venueCount.toLocaleString() : '1000+'}
                </h3>
                <p className="text-muted-foreground">Bowling Venues</p>
              </div>
              <div className="p-6">
                <h3 className="text-4xl font-bold text-primary mb-2">
                  {stateCount > 0 ? stateCount : '50+'}
                </h3>
                <p className="text-muted-foreground">States</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Bowling?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our comprehensive directory to find the perfect bowling alley for your next game, 
              party, or league night.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setLocation("/locations")}
                data-testid="button-find-alleys"
              >
                Find Bowling Alleys
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setLocation("/blog")}
                data-testid="button-learn-more"
              >
                Learn Bowling Tips
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions, suggestions, or want to add your bowling alley to our directory? 
              We'd love to hear from you.
            </p>
            <Button 
              size="lg" 
              onClick={() => setLocation("/contact")}
              data-testid="button-contact"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
