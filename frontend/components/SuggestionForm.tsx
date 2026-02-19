import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Suggestion } from "@/lib/firestore";

interface SuggestionFormProps {
  suggestion?: Suggestion;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function SuggestionForm({ suggestion, onSubmit, onCancel, isLoading }: SuggestionFormProps) {
  const [formData, setFormData] = useState({
    venueName: suggestion?.venueName || "",
    city: suggestion?.city || "",
    state: suggestion?.state || "",
    userEmail: suggestion?.userEmail || "",
    userDisplayName: suggestion?.userDisplayName || "",
    status: suggestion?.status || "pending",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.city.trim() || !formData.state.trim()) {
      return;
    }

    // Only include fields that have values to avoid Firestore undefined errors
    const submitData: any = {
      city: formData.city.trim(),
      state: formData.state.trim(),
      status: formData.status,
    };

    if (formData.venueName.trim()) {
      submitData.venueName = formData.venueName.trim();
    }
    if (formData.userEmail.trim()) {
      submitData.userEmail = formData.userEmail.trim();
    }
    if (formData.userDisplayName.trim()) {
      submitData.userDisplayName = formData.userDisplayName.trim();
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="venueName">Venue Name</Label>
        <Input
          id="venueName"
          value={formData.venueName}
          onChange={(e) => handleInputChange("venueName", e.target.value)}
          placeholder="Enter venue name (optional)"
          data-testid="input-suggestion-venue-name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            placeholder="Enter city"
            required
            data-testid="input-suggestion-city"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            placeholder="Enter state"
            required
            data-testid="input-suggestion-state"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userDisplayName">Submitted By</Label>
        <Input
          id="userDisplayName"
          value={formData.userDisplayName}
          onChange={(e) => handleInputChange("userDisplayName", e.target.value)}
          placeholder="User display name"
          data-testid="input-suggestion-user-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userEmail">User Email</Label>
        <Input
          id="userEmail"
          value={formData.userEmail}
          onChange={(e) => handleInputChange("userEmail", e.target.value)}
          placeholder="User email"
          type="email"
          data-testid="input-suggestion-user-email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
          <SelectTrigger data-testid="select-suggestion-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="implemented">Implemented</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading || !formData.city.trim() || !formData.state.trim()}
          data-testid="button-submit-suggestion"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
          data-testid="button-cancel-suggestion"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}