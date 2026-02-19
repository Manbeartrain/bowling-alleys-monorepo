import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Bookmark, MessageSquare, Trophy } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  mode,
  onModeChange,
}: AuthModalProps) {
  const { sendVerificationCode, verifyCodeAndSignIn } = useAuth();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      await sendVerificationCode(email);
      setCodeSent(true);
    } catch (error) {
      // Error handling is done in auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || verificationCode.length !== 6) return;

    setIsLoading(true);

    try {
      await verifyCodeAndSignIn(email, verificationCode);
      handleClose();
    } catch (error) {
      // Error handling is done in auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setVerificationCode("");
    setCodeSent(false);
    setIsLoading(false);
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  const handleResendCode = async () => {
    if (isLoading) return;
    setVerificationCode("");
    setIsLoading(true);
    
    try {
      await sendVerificationCode(email);
    } catch (error) {
      // Error handling is done in auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setCodeSent(false);
    setVerificationCode("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md" data-testid="auth-modal">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle
            data-testid="auth-modal-title"
            className="text-2xl font-bold"
          >
            {codeSent ? "Check Your Email" : "Sign In / Sign Up"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {codeSent
              ? `We sent a 6-digit code to ${email}`
              : mode === "signin" 
                ? "Enter your email to access your account"
                : "Enter your email to get started"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {!codeSent && (
            <div className="space-y-3 pb-2">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bookmark className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Save alleys and get notified when things change</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Leave reviews and help the community</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Earn points for doing anything on the platform</span>
              </div>
            </div>
          )}

          {!codeSent ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  data-testid="input-email"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-send-code"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-center block">
                  Enter 6-Digit Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={(value) => setVerificationCode(value)}
                    data-testid="input-verification-code"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Code expires in 10 minutes
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || verificationCode.length !== 6}
                data-testid="button-verify-code"
              >
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </Button>

              <div className="flex flex-col gap-2 text-center text-sm">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-primary hover:text-primary/80 h-auto p-0"
                  data-testid="button-resend-code"
                >
                  Resend Code
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToEmail}
                  className="text-muted-foreground hover:text-foreground h-auto p-0"
                  data-testid="button-back-to-email"
                >
                  Use Different Email
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
