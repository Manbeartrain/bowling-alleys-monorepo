import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useAuth } from "@/lib/auth";
import AuthModal from "@/components/AuthModal";

export default function FooterCTA() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");

  if (user) {
    return null;
  }

  const handleClick = () => {
    trackEvent("footer_cta_signup_click", "Footer CTA", "signup");
    setAuthModalOpen(true);
  };

  return (
    <>
      <Card className="border-dashed bg-white" data-testid="cta-footer-signup">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4  bg-white">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Bookmark className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-semibold text-sm " style={{ color: '#0d3149' }}>Save alleys & get updates if anything changes.</p>
            <p className="text-sm text-muted-foreground" style={{ color: '#0d3149' }}>Hours, prices, leagues, and specials change more often than you think.</p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleClick}
            data-testid="button-footer-signup"
          >
            Create Free Account
          </Button>
        </CardContent>
      </Card>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}
