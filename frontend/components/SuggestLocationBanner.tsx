import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { createSuggestion } from "@/lib/firestore";
import { Plus } from "lucide-react";

export default function SuggestLocationBanner() {
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [lanes, setLanes] = useState("");
  const [pricePerGame, setPricePerGame] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [shoeRentalPrice, setShoeRentalPrice] = useState("");
  const [hasCosmicBowling, setHasCosmicBowling] = useState(false);
  const [hasLeagues, setHasLeagues] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const RATE_LIMIT_SECONDS = 10;
  const RATE_LIMIT_KEY = "suggestion_last_submit";

  const checkRateLimit = (): boolean => {
    const lastSubmit = localStorage.getItem(RATE_LIMIT_KEY);
    if (!lastSubmit) return true;

    const lastSubmitTime = parseInt(lastSubmit);
    const now = Date.now();
    const timeDiff = now - lastSubmitTime;
    const secondsPassed = timeDiff / 1000;

    return secondsPassed >= RATE_LIMIT_SECONDS;
  };

  const getRemainingTime = (): number => {
    const lastSubmit = localStorage.getItem(RATE_LIMIT_KEY);
    if (!lastSubmit) return 0;

    const lastSubmitTime = parseInt(lastSubmit);
    const now = Date.now();
    const timeDiff = now - lastSubmitTime;
    const secondsPassed = timeDiff / 1000;
    const remaining = Math.ceil(RATE_LIMIT_SECONDS - secondsPassed);

    return remaining > 0 ? remaining : 0;
  };

  const resetForm = () => {
    setCity("");
    setState("");
    setVenueName("");
    setAddress("");
    setPhone("");
    setWebsite("");
    setFacebookUrl("");
    setInstagramUrl("");
    setLanes("");
    setPricePerGame("");
    setPricePerHour("");
    setShoeRentalPrice("");
    setHasCosmicBowling(false);
    setHasLeagues(false);
    setNotes("");
    if (!user) {
      setEmail("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!city.trim() || !state.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (City, State, Email)",
        variant: "destructive",
      });
      return;
    }

    if (!checkRateLimit()) {
      const remaining = getRemainingTime();
      toast({
        title: "Please Wait",
        description: `You can submit another suggestion in ${remaining} second${remaining !== 1 ? "s" : ""}. This helps prevent spam.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createSuggestion({
        city: city.trim(),
        state: state.trim(),
        email: email.trim(),
        venueName: venueName.trim() || undefined,
        address: address.trim() || undefined,
        userDisplayName: user?.displayName || undefined,
        userId: user?.uid,
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
        facebookUrl: facebookUrl.trim() || undefined,
        instagramUrl: instagramUrl.trim() || undefined,
        lanes: lanes ? parseInt(lanes) : undefined,
        pricePerGame: pricePerGame ? parseFloat(pricePerGame) : undefined,
        pricePerHour: pricePerHour ? parseFloat(pricePerHour) : undefined,
        shoeRentalPrice: shoeRentalPrice ? parseFloat(shoeRentalPrice) : undefined,
        hasCosmicBowling: hasCosmicBowling || undefined,
        hasLeagues: hasLeagues || undefined,
        notes: notes.trim() || undefined,
      });

      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());

      toast({
        title: "Success",
        description:
          "Thank you for your suggestion! We'll review it and add the location if possible.",
      });

      resetForm();
      setSuggestionModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Alert className="border-primary/20 bg-primary/5">
        <AlertDescription className="flex items-center justify-between">
          <span>
            Don't see your bowling alley? Let us know and we'll try to add it!
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSuggestionModalOpen(true)}
            data-testid="button-suggest-location"
            className="ml-4"
          >
            <Plus className="h-4 w-4 mr-1" />
            Suggest Location
          </Button>
        </AlertDescription>
      </Alert>

      <Dialog open={suggestionModalOpen} onOpenChange={setSuggestionModalOpen}>
        <DialogContent
          className="sm:max-w-lg max-h-[90vh]"
          data-testid="modal-location-suggestion"
        >
          <DialogHeader>
            <DialogTitle>Suggest a New Location</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="suggestion-venue-name">
                  Venue Name (optional)
                </Label>
                <Input
                  id="suggestion-venue-name"
                  data-testid="input-suggestion-venue-name"
                  placeholder="Enter venue name (if known)"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestion-address">Address (optional)</Label>
                <Input
                  id="suggestion-address"
                  data-testid="input-suggestion-address"
                  placeholder="Enter street address (if known)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="suggestion-city">City *</Label>
                  <Input
                    id="suggestion-city"
                    data-testid="input-suggestion-city"
                    placeholder="City name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suggestion-state">State *</Label>
                  <Input
                    id="suggestion-state"
                    data-testid="input-suggestion-state"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestion-phone">Phone (optional)</Label>
                <Input
                  id="suggestion-phone"
                  data-testid="input-suggestion-phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestion-website">Website (optional)</Label>
                <Input
                  id="suggestion-website"
                  data-testid="input-suggestion-website"
                  type="url"
                  placeholder="https://example.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="suggestion-facebook">Facebook URL</Label>
                  <Input
                    id="suggestion-facebook"
                    data-testid="input-suggestion-facebook"
                    placeholder="facebook.com/..."
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suggestion-instagram">Instagram URL</Label>
                  <Input
                    id="suggestion-instagram"
                    data-testid="input-suggestion-instagram"
                    placeholder="instagram.com/..."
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestion-lanes">Number of Lanes</Label>
                <Input
                  id="suggestion-lanes"
                  data-testid="input-suggestion-lanes"
                  type="number"
                  min="1"
                  placeholder="e.g., 24"
                  value={lanes}
                  onChange={(e) => setLanes(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="suggestion-price-game">Price/Game ($)</Label>
                  <Input
                    id="suggestion-price-game"
                    data-testid="input-suggestion-price-game"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="5.00"
                    value={pricePerGame}
                    onChange={(e) => setPricePerGame(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suggestion-price-hour">Price/Hour ($)</Label>
                  <Input
                    id="suggestion-price-hour"
                    data-testid="input-suggestion-price-hour"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="25.00"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suggestion-shoes">Shoe Rental ($)</Label>
                  <Input
                    id="suggestion-shoes"
                    data-testid="input-suggestion-shoes"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="4.00"
                    value={shoeRentalPrice}
                    onChange={(e) => setShoeRentalPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Features</Label>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="suggestion-cosmic"
                      checked={hasCosmicBowling}
                      onCheckedChange={(checked) => setHasCosmicBowling(checked === true)}
                      data-testid="checkbox-cosmic-bowling"
                    />
                    <Label htmlFor="suggestion-cosmic" className="text-sm font-normal cursor-pointer">
                      Cosmic Bowling
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="suggestion-leagues"
                      checked={hasLeagues}
                      onCheckedChange={(checked) => setHasLeagues(checked === true)}
                      data-testid="checkbox-leagues"
                    />
                    <Label htmlFor="suggestion-leagues" className="text-sm font-normal cursor-pointer">
                      Bowling Leagues
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestion-notes">Additional Notes</Label>
                <Textarea
                  id="suggestion-notes"
                  data-testid="input-suggestion-notes"
                  placeholder="Any other details about this venue..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestion-email">Your Email *</Label>
                <Input
                  id="suggestion-email"
                  data-testid="input-suggestion-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!!user}
                  className={user ? "bg-muted cursor-not-allowed" : ""}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSuggestionModalOpen(false)}
                  data-testid="button-cancel-suggestion"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="button-submit-suggestion"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
