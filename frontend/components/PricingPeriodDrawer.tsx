import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Clock, DollarSign, Plus, X } from "lucide-react";
import type { PricingPeriod } from "@/lib/firestore";
import { nanoid } from "nanoid";

interface PricingPeriodDrawerProps {
  period: PricingPeriod | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (period: PricingPeriod) => void;
  periodNumber?: number;
}

export function PricingPeriodDrawer({
  period,
  isOpen,
  onClose,
  onSave,
  periodNumber,
}: PricingPeriodDrawerProps) {
  const [formData, setFormData] = useState<PricingPeriod>({
    id: "",
    days: [],
    timeRange: "",
    price: 0,
    pricingType: "per_game",
    description: "",
    conditions: [],
    shoesIncluded: false,
    isSpecialEvent: false,
  });

  const [conditionInput, setConditionInput] = useState("");

  // Initialize form when period changes
  useEffect(() => {
    if (period) {
      setFormData(period);
    } else {
      // New period
      setFormData({
        id: nanoid(),
        days: [],
        timeRange: "",
        price: 0,
        pricingType: "per_game",
        description: "",
        conditions: [],
        shoesIncluded: false,
        isSpecialEvent: false,
      });
    }
  }, [period, isOpen]);

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleAddCondition = () => {
    if (conditionInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        conditions: [...(prev.conditions || []), conditionInput.trim()],
      }));
      setConditionInput("");
    }
  };

  const handleRemoveCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (formData.days.length === 0) {
      return;
    }
    if (formData.price <= 0) {
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto bg-white z-[9999]">
        <SheetHeader className="pb-6">
          <SheetTitle>
            {period
              ? `Edit Period ${periodNumber || ""}`
              : "New Pricing Period"}
          </SheetTitle>
          <SheetDescription>
            Configure pricing for specific days and times
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Days Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Days *</Label>
            <div className="grid grid-cols-7 gap-2">
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <Button
                  key={day}
                  type="button"
                  variant={formData.days.includes(day) ? "default" : "outline"}
                  className="px-2"
                  onClick={() => handleDayToggle(day)}
                  data-testid={`drawer-day-${day}`}
                >
                  {day.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>

          {/* Time & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="drawer-time-range">Time Range</Label>
              <Input
                id="drawer-time-range"
                value={formData.timeRange}
                onChange={(e) =>
                  setFormData({ ...formData, timeRange: e.target.value })
                }
                placeholder="9AM-5PM"
                data-testid="drawer-input-time-range"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="drawer-price">Price ($) *</Label>
              <Input
                id="drawer-price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                data-testid="drawer-input-price"
              />
            </div>
          </div>

          {/* Pricing Type */}
          <div className="space-y-2">
            <Label htmlFor="drawer-pricing-type">Pricing Type</Label>
            <Select
              value={formData.pricingType}
              onValueChange={(value: any) =>
                setFormData({ ...formData, pricingType: value })
              }
            >
              <SelectTrigger
                id="drawer-pricing-type"
                data-testid="drawer-select-pricing-type"
              >
                <SelectValue placeholder="Select pricing type" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                <SelectItem value="per_game">Per Game</SelectItem>
                <SelectItem value="per_person_per_game">
                  Per Person Per Game
                </SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="all_you_can_bowl">
                  All-You-Can-Bowl
                </SelectItem>
                <SelectItem value="package">Package</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="drawer-description">Description</Label>
            <Textarea
              id="drawer-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g., Weekend prime time pricing"
              rows={2}
              data-testid="drawer-textarea-description"
            />
          </div>

          {/* Options */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="drawer-shoes-included"
                checked={formData.shoesIncluded}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    shoesIncluded: checked as boolean,
                  })
                }
                data-testid="drawer-checkbox-shoes-included"
              />
              <Label
                htmlFor="drawer-shoes-included"
                className="cursor-pointer font-normal"
              >
                Shoe rental included
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="drawer-special-event"
                checked={formData.isSpecialEvent}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    isSpecialEvent: checked as boolean,
                  })
                }
                data-testid="drawer-checkbox-special-event"
              />
              <Label
                htmlFor="drawer-special-event"
                className="cursor-pointer font-normal"
              >
                Special Event (Cosmic, etc.)
              </Label>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-3">
            <Label>Conditions</Label>
            <div className="flex gap-2">
              <Input
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCondition();
                  }
                }}
                placeholder="Seniors 55+, League bowlers"
                data-testid="drawer-input-condition"
              />
              <Button
                type="button"
                onClick={handleAddCondition}
                size="icon"
                variant="outline"
                data-testid="drawer-button-add-condition"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.conditions && formData.conditions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.conditions.map((condition, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="gap-1 pr-1"
                    data-testid={`drawer-condition-${idx}`}
                  >
                    {condition}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveCondition(idx)}
                      data-testid={`drawer-button-remove-condition-${idx}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="gap-2 pt-8 mt-8 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-testid="drawer-button-cancel"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={formData.days.length === 0 || formData.price <= 0}
            data-testid="drawer-button-save"
          >
            Save Period
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
