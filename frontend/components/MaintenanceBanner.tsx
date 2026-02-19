import { Card, CardContent } from "@/components/ui/card";

export function MaintenanceBanner() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="text-4xl mb-4">🎳</div>
          <h2 className="text-xl font-semibold mb-2">We'll Be Right Back</h2>
          <p className="text-muted-foreground">
            We're doing some quick maintenance. Please check back in a few minutes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
