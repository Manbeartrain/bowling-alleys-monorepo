import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Crown, Star, Mail, Trophy, Zap, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFoundingPartners, type Venue } from "@/lib/firestore";

export default function FoundingPartners() {
  const { data: foundingPartners, isLoading } = useQuery({
    queryKey: ["/api/founding-partners"],
    queryFn: getFoundingPartners,
  });

  const spotsRemaining = 50 - (foundingPartners?.length || 0);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Founding Partners | BowlingAlleys.io</title>
        <meta
          name="description"
          content="Celebrating the first 50 bowling alleys to join BowlingAlleys.io. Our Founding Partners are modernizing bowling's online presence across America."
        />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Limited to 50 Alleys</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Founding Partners
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Celebrating the First 50 Alleys Who Joined the Movement
            </p>

            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              BowlingAlleys.io is building the digital home for bowling — a modern platform connecting bowlers and alley owners across the country.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                {foundingPartners?.length || 0} / 50 Spots Claimed
              </Badge>
              {spotsRemaining > 0 && (
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {spotsRemaining} Remaining
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What It Means to Be a Founding Partner
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Becoming a Founding Partner isn't just a badge — it's recognition as one of the{" "}
            <strong>first 50 bowling alleys</strong> shaping the future of bowling online.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Crown className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>Permanent Badge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Display a prestigious "Founding Partner" badge on your profile forever.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="w-8 h-8 text-yellow-600 mb-2" />
              <CardTitle>Priority Placement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Featured positioning on your city and state hub pages.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Early Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get first access to new owner tools and platform features.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Exclusive Promotions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Special homepage visibility and promotional opportunities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-orange-600 mb-2" />
              <CardTitle>Direct Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Priority support and direct channel with the BowlingAlleys.io team.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <Trophy className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Legacy Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Once all 50 spots are filled, the badge is locked forever.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why It Matters Section */}
        <div className="bg-muted/30 rounded-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Why It Matters</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-lg">
            <p>
              For too long, bowling alleys have been hidden behind outdated websites, broken links, or Facebook pages that don't show up on Google.
            </p>
            <p className="font-medium">
              We're fixing that — and our Founding Partners are leading the charge.
            </p>
            <p>Each claimed alley helps bowlers:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Find accurate information without calling ahead</li>
              <li>Discover leagues, specials, and cosmic nights nearby</li>
              <li>Leave real reviews and support local bowling</li>
            </ul>
            <p className="font-medium text-center pt-4">
              Together, we're making bowling more <strong>discoverable</strong>, <strong>connected</strong>, and <strong>profitable</strong> for everyone involved.
            </p>
          </div>
        </div>

        {/* Founding Partners Grid */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Meet Our Founding Partners
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            The first 50 alleys that claimed their profiles and helped build the foundation of BowlingAlleys.io.
          </p>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">Loading founding partners...</p>
            </div>
          ) : foundingPartners && foundingPartners.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundingPartners.map((venue) => (
                <Link key={venue.id} href={`/venue/${venue.id}`} data-testid={`link-venue-${venue.id}`}>
                  <Card className="hover-elevate cursor-pointer h-full" data-testid={`card-venue-${venue.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-2">
                            {venue.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {venue.city}, {venue.state}
                          </CardDescription>
                        </div>
                        <Crown className="w-6 h-6 text-purple-600 flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{venue.avgRating.toFixed(1)}</span>
                        <span>•</span>
                        <span>{venue.lanes} lanes</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                Be the first to join as a Founding Partner!
              </p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        {spotsRemaining > 0 && (
          <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Become a Founding Partner
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              There are only <strong className="text-primary">{spotsRemaining} spots remaining</strong> for Founding Partners — and once they're filled, the badge will be locked forever.
            </p>
            <p className="mb-8 text-foreground/80">
              If you're a bowling alley owner who believes in modernizing the game, this is your chance to join the first wave.
            </p>
            <Link href="/owner">
              <Button size="lg" className="text-lg px-8" data-testid="button-claim-alley">
                Claim Your Alley →
              </Button>
            </Link>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Questions?</h3>
          <p className="text-lg mb-2">Reach out directly:</p>
          <p className="text-xl font-semibold mb-1">Gabe "Ace" Higareda</p>
          <p className="text-muted-foreground mb-4">Founder, BowlingAlleys.io</p>
          <a
            href="mailto:ace@bowlingalleys.io"
            className="inline-flex items-center gap-2 text-primary hover:underline text-lg"
            data-testid="link-contact-email"
          >
            <Mail className="w-5 h-5" />
            ace@bowlingalleys.io
          </a>
        </div>
      </div>

    </div>
  );
}
