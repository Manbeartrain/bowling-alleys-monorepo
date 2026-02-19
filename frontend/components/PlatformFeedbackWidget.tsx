import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { submitPlatformFeedback } from "@/lib/feedbackService";
import { Loader2, X, CheckCircle } from "lucide-react";

type PlatformFeedbackWidgetProps = {
  pageId: string;
  pageType: "venue" | "experience" | "cityHub" | string;
};

export type PlatformFeedbackWidgetRef = {
  openWidget: () => void;
};

type FeedbackState = "initial" | "yes" | "no" | "submitted";

export const PlatformFeedbackWidget = forwardRef<PlatformFeedbackWidgetRef, PlatformFeedbackWidgetProps>(
  ({ pageId, pageType }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [state, setState] = useState<FeedbackState>("initial");
    const [email, setEmail] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [showPulse, setShowPulse] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useImperativeHandle(ref, () => ({
      openWidget: () => {
        setIsOpen(true);
        setShowPulse(false);
      },
    }));

    useEffect(() => {
      const timer = setTimeout(() => {
        if (!isOpen && state === "initial") {
          setShowPulse(true);
          setTimeout(() => setShowPulse(false), 3000);
        }
      }, 25000);

      return () => clearTimeout(timer);
    }, [isOpen, state]);

    const handleYesClick = () => {
      setState("yes");
      setError(null);
    };

    const handleNoClick = () => {
      setState("no");
      setError(null);
    };

    const handleYesSubmit = async () => {
      setIsSubmitting(true);
      setError(null);

      try {
        await submitPlatformFeedback({
          pageId,
          pageType,
          wasUseful: true,
          email: email.trim() || undefined,
        });
        setSuccessMessage("You're in! Thanks for supporting BAiO.");
        setState("submitted");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (err) {
        setError("Something went wrong, please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleNoSubmit = async () => {
      if (!comment.trim()) {
        setError("Please tell us what was missing or inaccurate.");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        await submitPlatformFeedback({
          pageId,
          pageType,
          wasUseful: false,
          comment: comment.trim(),
          email: email.trim() || undefined,
        });
        setSuccessMessage("Thanks — your feedback helps everyone bowl better.");
        setState("submitted");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (err) {
        setError("Something went wrong, please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
      setIsOpen(false);
      if (state === "submitted") {
        setState("initial");
        setEmail("");
        setComment("");
        setSuccessMessage("");
      }
    };

    const handleOpenWidget = () => {
      setIsOpen(true);
      setShowPulse(false);
    };

    return (
      <>
        {!isOpen && (
          <Button
            onClick={handleOpenWidget}
            className={`shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white ${showPulse ? "animate-pulse ring-4 ring-red-300" : ""}`}
            style={{
              position: "fixed",
              bottom: "80px",
              right: "24px",
              zIndex: 40,
              backgroundColor: "#d52231",
            }}
            size="lg"
            data-testid="button-feedback-fab"
            aria-label="Give Feedback"
          >
            👍 Was This Useful?
          </Button>
        )}

        {isOpen && (
          <Card
            className={`shadow-2xl border-2 transition-all duration-300 ${showSuccess ? "ring-4 ring-green-400" : ""}`}
            style={{
              position: "fixed",
              bottom: "80px",
              right: "24px",
              zIndex: 50,
              width: "min(360px, calc(100vw - 48px))",
            }}
            data-testid="feedback-widget"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-foreground">
                  {state === "submitted" ? "🎉 Thank You!" : "Was this information useful?"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-7 w-7 -mt-1 -mr-1"
                  data-testid="button-feedback-close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {state === "initial" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleYesClick}
                    data-testid="button-feedback-yes"
                    className="flex-1 flex items-center justify-center gap-1.5"
                  >
                    👍 Yes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNoClick}
                    data-testid="button-feedback-no"
                    className="flex-1 flex items-center justify-center gap-1.5"
                  >
                    👎 No
                  </Button>
                </div>
              )}

              {state === "yes" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    🎳 Awesome! Want early access to new bowling features?
                  </p>
                  <Input
                    type="email"
                    placeholder="Email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-feedback-email"
                  />
                  <Button
                    onClick={handleYesSubmit}
                    disabled={isSubmitting}
                    className="w-full"
                    data-testid="button-feedback-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              )}

              {state === "no" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    What was missing or inaccurate?
                  </p>
                  <Textarea
                    placeholder="Please share your feedback..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isSubmitting}
                    className="min-h-[80px] resize-none"
                    data-testid="textarea-feedback-comment"
                  />
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Want us to email you once we fix it?
                    </label>
                    <Input
                      type="email"
                      placeholder="Email (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      data-testid="input-feedback-email"
                    />
                  </div>
                  <Button
                    onClick={handleNoSubmit}
                    disabled={isSubmitting}
                    className="w-full"
                    data-testid="button-feedback-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              )}

              {state === "submitted" && (
                <div data-testid="feedback-success" className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-muted-foreground">{successMessage}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </>
    );
  }
);

PlatformFeedbackWidget.displayName = "PlatformFeedbackWidget";
