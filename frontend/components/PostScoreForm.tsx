import { useState, lazy, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Trophy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { createGame, checkUserGameRateLimit } from "@/lib/firestore";

const AuthModal = lazy(() => import("@/components/AuthModal"));

// Score form schema
const scoreSchema = z.object({
  score: z.coerce
    .number()
    .min(0, "Score must be at least 0")
    .max(300, "Score must be at most 300"),
  type: z.enum(['casual', 'league', 'practice']),
  laneNumber: z.string().optional(),
  photoUrl: z.string().min(1, "Photo proof is required"),
});

type ScoreFormData = z.infer<typeof scoreSchema>;

interface PostScoreFormProps {
  venueId: string;
  venueName: string;
}

export default function PostScoreForm({ venueId, venueName }: PostScoreFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const form = useForm<ScoreFormData>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      score: 0,
      type: 'casual',
      laneNumber: '',
      photoUrl: '',
    },
  });

  // Check rate limit before submitting
  const checkRateLimit = async () => {
    if (!user) return { canPost: false };
    return await checkUserGameRateLimit(venueId, user.uid);
  };

  const submitMutation = useMutation({
    mutationFn: async (data: ScoreFormData) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      // Check rate limit
      const rateLimitCheck = await checkRateLimit();
      if (!rateLimitCheck.canPost) {
        throw new Error(
          `Please wait ${rateLimitCheck.timeRemaining} more minutes before posting again.`
        );
      }

      // Submit the game
      await createGame(
        venueId,
        user.uid,
        user.displayName || "Anonymous",
        user.photoURL || undefined,
        data.score,
        data.photoUrl,
        data.type,
        data.laneNumber || undefined,
        'America/New_York' // Default timezone
      );
    },
    onSuccess: () => {
      toast({
        title: "Score submitted!",
        description: "Your score is pending approval and will appear on the leaderboard once approved.",
      });
      setSubmittedSuccessfully(true);
      form.reset();
      setPhotoUrl("");
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10485760) {
      toast({
        title: "Error",
        description: "Image file must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsUploading(true);

    try {
      // Get Firebase ID token for authentication
      const idToken = await user.getIdToken();

      // Get upload URL from backend
      const uploadResponse = await fetch('/api/objects/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL } = await uploadResponse.json();

      // Upload file to object storage
      const uploadFileResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadFileResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Extract the object path from the upload URL
      const urlObj = new URL(uploadURL);
      const objectPath = urlObj.pathname;

      // Make the image public
      const aclResponse = await fetch('/api/venue-images', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ path: objectPath }),
      });

      if (!aclResponse.ok) {
        throw new Error('Failed to make image public');
      }

      const { publicUrl } = await aclResponse.json();
      setPhotoUrl(publicUrl);
      form.setValue('photoUrl', publicUrl);

      toast({
        title: "Success",
        description: "Photo uploaded successfully!",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data: ScoreFormData) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    submitMutation.mutate(data);
  };

  if (submittedSuccessfully) {
    return (
      <div className="text-center py-8 space-y-4" data-testid="success-message">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <div>
          <h3 className="text-xl font-semibold">Score Submitted!</h3>
          <p className="text-muted-foreground mt-2">
            Your score is pending approval. Once approved, it will appear on the leaderboard.
          </p>
        </div>
        <Button
          onClick={() => setSubmittedSuccessfully(false)}
          data-testid="button-submit-another"
        >
          Submit Another Score
        </Button>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo" data-testid="label-photo-proof">
              Photo Proof *
            </Label>
            <div className="flex flex-col gap-4">
              {photoUrl && (
                <div className="relative w-full max-w-sm" data-testid="preview-photo">
                  <img
                    src={photoUrl}
                    alt="Score proof"
                    className="rounded-lg border w-full h-auto object-cover"
                  />
                </div>
              )}
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isUploading}
                data-testid="input-photo"
              />
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading photo...</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a clear photo of your score screen
            </p>
          </div>

          {/* Score Input */}
          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="label-score">Score *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="300"
                    placeholder="0"
                    {...field}
                    data-testid="input-score"
                  />
                </FormControl>
                <FormDescription>Enter your score (0-300)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Game Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="label-game-type">Game Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-game-type">
                      <SelectValue placeholder="Select game type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="casual" data-testid="option-casual">Casual</SelectItem>
                    <SelectItem value="league" data-testid="option-league">League</SelectItem>
                    <SelectItem value="practice" data-testid="option-practice">Practice</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Lane Number (Optional) */}
          <FormField
            control={form.control}
            name="laneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="label-lane-number">Lane Number (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 12"
                    {...field}
                    data-testid="input-lane-number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rate Limit Info */}
          <Alert>
            <AlertDescription className="text-sm">
              You can post one score per venue every 10 minutes.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={submitMutation.isPending || isUploading || !photoUrl}
            data-testid="button-submit-score"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Trophy className="mr-2 h-4 w-4" />
                Submit Score
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Auth Modal */}
      {showAuthModal && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            mode={authMode}
            onModeChange={setAuthMode}
          />
        </Suspense>
      )}
    </>
  );
}
