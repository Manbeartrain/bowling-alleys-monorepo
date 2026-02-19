import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  X,
  Plus,
  Clock,
  HelpCircle,
  DollarSign,
  MapPin,
  Image as ImageIcon,
  ChevronDown,
  Mail,
  Phone,
  Globe,
  User,
  Code,
  Copy,
  Check,
} from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiTiktok } from "react-icons/si";
import { ImageUploader } from "@/components/ImageUploader";
import { PricingPeriodDrawer } from "@/components/PricingPeriodDrawer";
import { PricingPeriodListRow } from "@/components/PricingPeriodListRow";
import type { Venue, PricingPeriod, AdditionalPricingItem, Amenity } from "@/lib/firestore";
import { getAllAmenities } from "@/lib/firestore";
import { nanoid } from "nanoid";

interface VenueFormProps {
  venue?: Venue;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isOwnerMode?: boolean; // Hide admin-only fields when true
}

export default function VenueForm({
  venue,
  onSubmit,
  onCancel,
  isLoading,
  isOwnerMode = false,
}: VenueFormProps) {
  // Fetch standard amenities from central collection
  const {
    data: standardAmenities,
    isLoading: loadingAmenities,
  } = useQuery({
    queryKey: ["/amenities"],
    queryFn: getAllAmenities,
  });

  const [copiedEmbed, setCopiedEmbed] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: venue?.name || "",
    seoTitle: (venue as any)?.seoTitle || "",
    description: venue?.description || "",
    address: venue?.address || "",
    city: venue?.city || "",
    state: venue?.state || "",
    zipCode: venue?.zipCode || venue?.postalCode || "",
    phone: venue?.phone || "",
    email: venue?.email || "",
    website: venue?.website || "",
    facebookUrl: venue?.facebookUrl || "",
    instagramUrl: venue?.instagramUrl || "",
    twitterUrl: venue?.twitterUrl || "",
    tikTokUrl: venue?.tikTokUrl || "",
    claimedByEmail: venue?.claimedByEmail || "",
    ownerId: venue?.ownerId || "",
    logoUrl: venue?.logoUrl || "",
    coverImageUrl: venue?.coverImageUrl || "",
    imageUrls: venue?.imageUrls || [],
    lanes: venue?.lanes || 1,
    isActive: venue?.isActive !== false,
    isFranchise: venue?.isFranchise || false,
    location: {
      latitude: venue?.location?.latitude || venue?.lat || null,
      longitude: venue?.location?.longitude || venue?.lng || null,
    },
    pricing: {
      game: venue?.pricing?.game || 0,
      hourly: venue?.pricing?.hourly || 0,
      shoeRental: venue?.pricing?.shoeRental || 0,
    },
    pricingDetails: {
      periods: (venue as any)?.pricingDetails?.periods || [],
      additionalItems: (venue as any)?.pricingDetails?.additionalItems || [],
      notes: (venue as any)?.pricingDetails?.notes || [],
    },
    amenities: venue?.amenities || [],
    periods: (venue as any)?.periods || [],
    weekdayText: (venue as any)?.weekdayText || ["", "", "", "", "", "", ""],
  });

  const [newAmenity, setNewAmenity] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  
  // Drawer state for pricing period editing
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<PricingPeriod | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData((prev) => {
      const currentSection = prev[section as keyof typeof prev] as Record<
        string,
        any
      >;
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value,
        },
      };
    });
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      if (prev.amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: prev.amenities.filter((a) => a !== amenity),
        };
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity],
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure proper data types for submission
    const submissionData = {
      ...formData,
      lanes: parseInt(formData.lanes.toString()) || 1,
      location: {
        latitude: formData.location.latitude ? parseFloat(formData.location.latitude.toString()) : null,
        longitude: formData.location.longitude ? parseFloat(formData.location.longitude.toString()) : null,
      },
      pricing: {
        game: parseFloat(formData.pricing.game.toString()) || 0,
        hourly: parseFloat(formData.pricing.hourly.toString()) || 0,
        shoeRental: parseFloat(formData.pricing.shoeRental.toString()) || 0,
      },
      pricingDetails: formData.pricingDetails,
      // Always include periods and weekdayText
      periods: formData.periods,
      weekdayText: formData.weekdayText.filter(
        (text: string) => text.trim() !== "",
      ),
    };

    onSubmit(submissionData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target === e.currentTarget) {
      e.preventDefault();
      addAmenity();
    }
  };

  // Pricing Details Helper Functions
  const addPricingPeriod = () => {
    setEditingPeriod(null);
    setDrawerOpen(true);
  };

  const handleEditPeriod = (period: PricingPeriod) => {
    setEditingPeriod(period);
    setDrawerOpen(true);
  };

  const handleSavePeriod = (period: PricingPeriod) => {
    setFormData((prev) => {
      const existingIndex = prev.pricingDetails.periods.findIndex((p: PricingPeriod) => p.id === period.id);
      if (existingIndex >= 0) {
        const updatedPeriods = [...prev.pricingDetails.periods];
        updatedPeriods[existingIndex] = period;
        return {
          ...prev,
          pricingDetails: {
            ...prev.pricingDetails,
            periods: updatedPeriods,
          },
        };
      } else {
        return {
          ...prev,
          pricingDetails: {
            ...prev.pricingDetails,
            periods: [...prev.pricingDetails.periods, period],
          },
        };
      }
    });
    setDrawerOpen(false);
    setEditingPeriod(null);
  };

  const removePricingPeriod = (periodId: string) => {
    setFormData((prev) => ({
      ...prev,
      pricingDetails: {
        ...prev.pricingDetails,
        periods: prev.pricingDetails.periods.filter((p: PricingPeriod) => p.id !== periodId),
      },
    }));
  };

  const addAdditionalItem = () => {
    const newItem: AdditionalPricingItem = {
      id: nanoid(),
      name: "",
      price: 0,
      unit: "",
    };
    setFormData((prev) => ({
      ...prev,
      pricingDetails: {
        ...prev.pricingDetails,
        additionalItems: [...prev.pricingDetails.additionalItems, newItem],
      },
    }));
  };

  const updateAdditionalItem = (itemId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      pricingDetails: {
        ...prev.pricingDetails,
        additionalItems: prev.pricingDetails.additionalItems.map((item: AdditionalPricingItem) =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const removeAdditionalItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      pricingDetails: {
        ...prev.pricingDetails,
        additionalItems: prev.pricingDetails.additionalItems.filter((item: AdditionalPricingItem) => item.id !== itemId),
      },
    }));
  };

  const addNote = (note: string) => {
    if (note.trim()) {
      setFormData((prev) => ({
        ...prev,
        pricingDetails: {
          ...prev.pricingDetails,
          notes: [...prev.pricingDetails.notes, note.trim()],
        },
      }));
    }
  };

  const removeNote = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pricingDetails: {
        ...prev.pricingDetails,
        notes: prev.pricingDetails.notes.filter((_: string, i: number) => i !== index),
      },
    }));
  };

  // Helper component for labels with tooltips
  const LabelWithTooltip = ({ 
    htmlFor, 
    label, 
    tooltip 
  }: { 
    htmlFor: string; 
    label: string; 
    tooltip: string;
  }) => (
    <div className="flex items-center gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px]">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  // For owner mode, use tabs to organize the form
  if (isOwnerMode) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" data-testid="tab-venue-info">Venue Info</TabsTrigger>
            <TabsTrigger value="photos" data-testid="tab-photos">Photos</TabsTrigger>
            <TabsTrigger value="resources" data-testid="tab-resources">Resources & Embeds</TabsTrigger>
          </TabsList>

          {/* Tab 1: Venue Info */}
          <TabsContent value="info" className="space-y-6 mt-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <LabelWithTooltip 
                      htmlFor="name" 
                      label="Name *" 
                      tooltip="The official name of your bowling center. Example: 'Strike Zone Lanes' or 'Downtown Bowl'"
                    />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Strike Zone Lanes"
                      required
                      data-testid="input-venue-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip 
                      htmlFor="lanes" 
                      label="Number of Lanes *" 
                      tooltip="Total number of bowling lanes in your facility. Example: If you have 24 lanes, enter '24'"
                    />
                    <Input
                      id="lanes"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.lanes}
                      onChange={(e) =>
                        handleInputChange("lanes", parseInt(e.target.value) || 1)
                      }
                      required
                      data-testid="input-venue-lanes"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <LabelWithTooltip 
                    htmlFor="description" 
                    label="Description" 
                    tooltip="Describe what makes your bowling alley special. Mention unique features, atmosphere, or what bowlers love about your venue. Example: 'Family-friendly bowling center with state-of-the-art lanes, arcade, and full-service restaurant.'"
                  />
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Family-friendly bowling center with state-of-the-art lanes..."
                    rows={4}
                    data-testid="input-venue-description"
                  />
                </div>

                {!isOwnerMode && (
                  <div className="space-y-2">
                    <LabelWithTooltip 
                      htmlFor="logo" 
                      label="Venue Logo" 
                      tooltip="Upload your venue's logo. This will be displayed on your venue page. Recommended size: 400x400 pixels."
                    />
                    <ImageUploader
                      currentImageUrl={formData.logoUrl}
                      onImageUrlChange={(url: string) => handleInputChange("logoUrl", url)}
                      label="Venue Logo"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter <strong>average</strong> prices. Help customers know the maximum they'll spend so there are no surprises.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <LabelWithTooltip 
                      htmlFor="gamePrice" 
                      label="Per Game ($)" 
                      tooltip="Average cost per game. Example: If games range from $4-$6, enter $5. This helps customers budget for their visit without surprises."
                    />
                    <Input
                      id="gamePrice"
                      type="text"
                      inputMode="decimal"
                      value={formData.pricing.game}
                      onChange={(e) =>
                        handleNestedChange("pricing", "game", parseFloat(e.target.value) || 0)
                      }
                      placeholder="5.00"
                      data-testid="input-price-game"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip 
                      htmlFor="hourlyPrice" 
                      label="Per Hour ($)" 
                      tooltip="Average hourly rate per lane. Example: If hourly rates range from $35-$45, enter $40. This represents what most customers will pay during regular hours."
                    />
                    <Input
                      id="hourlyPrice"
                      type="text"
                      inputMode="decimal"
                      value={formData.pricing.hourly}
                      onChange={(e) =>
                        handleNestedChange("pricing", "hourly", parseFloat(e.target.value) || 0)
                      }
                      placeholder="40.00"
                      data-testid="input-price-hourly"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip 
                      htmlFor="shoeRental" 
                      label="Shoe Rental ($)" 
                      tooltip="Average shoe rental price. Example: If shoes cost $4-$6 depending on size, enter $5. Customers appreciate knowing the maximum rental cost upfront."
                    />
                    <Input
                      id="shoeRental"
                      type="text"
                      inputMode="decimal"
                      value={formData.pricing.shoeRental}
                      onChange={(e) =>
                        handleNestedChange("pricing", "shoeRental", parseFloat(e.target.value) || 0)
                      }
                      placeholder="5.00"
                      data-testid="input-price-shoes"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Amenities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Important:</strong> Select amenities from the list below or add custom ones. Using standard amenities ensures maximum visibility in search results.
                  </p>
                </div>

                {/* Standard Amenities - Clickable Options */}
                {standardAmenities && standardAmenities.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Quick Select (Recommended)</Label>
                    <p className="text-xs text-muted-foreground">
                      Most amenities you need are here. Use these standard tags for better search visibility. Hover for details.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {standardAmenities.map((amenity) => {
                        const isSelected = formData.amenities.includes(amenity.name);
                        const amenitySlug = amenity.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                        
                        if (amenity.description) {
                          return (
                            <Tooltip key={amenity.id}>
                              <TooltipTrigger asChild>
                                <span>
                                  <Badge
                                    variant={isSelected ? "default" : "outline"}
                                    className={`cursor-pointer transition-colors ${
                                      isSelected 
                                        ? "bg-primary text-primary-foreground" 
                                        : "hover:bg-muted"
                                    }`}
                                    onClick={() => toggleAmenity(amenity.name)}
                                    data-testid={`badge-standard-amenity-${amenitySlug}`}
                                  >
                                    {isSelected && <Check className="h-3 w-3 mr-1" />}
                                    {amenity.name}
                                  </Badge>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{amenity.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        }
                        return (
                          <Badge
                            key={amenity.id}
                            variant={isSelected ? "default" : "outline"}
                            className={`cursor-pointer transition-colors ${
                              isSelected 
                                ? "bg-primary text-primary-foreground" 
                                : "hover:bg-muted"
                            }`}
                            onClick={() => toggleAmenity(amenity.name)}
                            data-testid={`badge-standard-amenity-${amenitySlug}`}
                          >
                            {isSelected && <Check className="h-3 w-3 mr-1" />}
                            {amenity.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {loadingAmenities && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Loading standard amenities...
                  </div>
                )}

                <Separator />

                {/* Custom Amenity Input */}
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <LabelWithTooltip 
                      htmlFor="new-amenity" 
                      label="Add Custom Amenity" 
                      tooltip="Add a custom amenity if it's not in the standard list above. Type the name and press Enter or click the plus button."
                    />
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="new-amenity"
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type custom amenity and press Enter..."
                        data-testid="input-new-amenity"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addAmenity}
                        data-testid="button-add-amenity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Selected Amenities */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Selected Amenities ({formData.amenities.length})</Label>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-muted/30 rounded-lg border border-dashed">
                    {formData.amenities.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No amenities selected</p>
                    ) : (
                      formData.amenities.map((amenity: string, index: number) => {
                        const isStandard = standardAmenities?.some(sa => sa.name === amenity);
                        return (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="gap-1"
                            data-testid={`badge-amenity-${index}`}
                          >
                            {amenity}
                            {!isStandard && (
                              <span className="text-xs opacity-60">(custom)</span>
                            )}
                            <X
                              className="h-3 w-3 cursor-pointer ml-1"
                              onClick={() => removeAmenity(amenity)}
                              data-testid={`button-remove-amenity-${index}`}
                            />
                          </Badge>
                        );
                      })
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address, Contact & Location */}
            <Collapsible open={isAddressOpen} onOpenChange={setIsAddressOpen}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Address, Contact & Location
                      </CardTitle>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${isAddressOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <LabelWithTooltip 
                        htmlFor="address" 
                        label="Street Address" 
                        tooltip="Your venue's physical address. This field is managed by our team to ensure accuracy for map display and search results."
                      />
                      <Input
                        id="address"
                        value={formData.address}
                        disabled
                        className="bg-muted"
                        data-testid="input-venue-address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <LabelWithTooltip 
                          htmlFor="city" 
                          label="City" 
                          tooltip="Your venue's city. This field is managed by our team to ensure consistency across the directory."
                        />
                        <Input
                          id="city"
                          value={formData.city}
                          disabled
                          className="bg-muted"
                          data-testid="input-venue-city"
                        />
                      </div>
                      <div className="space-y-2">
                        <LabelWithTooltip 
                          htmlFor="state" 
                          label="State" 
                          tooltip="Your venue's state. This field is managed by our team to maintain data integrity."
                        />
                        <Input
                          id="state"
                          value={formData.state}
                          disabled
                          className="bg-muted"
                          data-testid="input-venue-state"
                        />
                      </div>
                      <div className="space-y-2">
                        <LabelWithTooltip 
                          htmlFor="zipCode" 
                          label="ZIP Code" 
                          tooltip="Your venue's ZIP code. This field is managed by our team for accuracy."
                        />
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          disabled
                          className="bg-muted"
                          data-testid="input-venue-zipcode"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <LabelWithTooltip 
                          htmlFor="phone" 
                          label="Phone" 
                          tooltip="Your venue's main contact phone number. Example: (555) 123-4567. Make it easy for customers to call you!"
                        />
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="(555) 123-4567"
                            data-testid="input-venue-phone"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <LabelWithTooltip 
                          htmlFor="email" 
                          label="Email" 
                          tooltip="Your venue's contact email address. Example: info@yourbowl.com. This will be visible to customers who want to reach you."
                        />
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="info@yourbowl.com"
                            data-testid="input-venue-email"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <LabelWithTooltip 
                          htmlFor="website" 
                          label="Website" 
                          tooltip="Your venue's official website URL. Example: https://yourbowl.com. Include the full URL starting with https://"
                        />
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                            placeholder="https://yourbowl.com"
                            data-testid="input-venue-website"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <LabelWithTooltip 
                          htmlFor="facebookUrl" 
                          label="Facebook URL" 
                          tooltip="Your venue's Facebook page URL. Example: https://facebook.com/yourbowlingalley. This helps customers connect with you on social media."
                        />
                        <div className="flex items-center gap-2">
                          <SiFacebook className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="facebookUrl"
                            value={formData.facebookUrl}
                            onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
                            placeholder="https://facebook.com/yourbowlingalley"
                            data-testid="input-venue-facebook"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <LabelWithTooltip 
                          htmlFor="instagramUrl" 
                          label="Instagram URL" 
                          tooltip="Your venue's Instagram profile URL. Example: https://instagram.com/yourbowlingalley. This helps customers follow you on Instagram."
                        />
                        <div className="flex items-center gap-2">
                          <SiInstagram className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="instagramUrl"
                            value={formData.instagramUrl}
                            onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                            placeholder="https://instagram.com/yourbowlingalley"
                            data-testid="input-venue-instagram"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <LabelWithTooltip 
                          htmlFor="twitterUrl" 
                          label="X / Twitter URL" 
                          tooltip="Your venue's X (Twitter) profile URL. Example: https://x.com/yourbowlingalley. This helps customers follow you on X."
                        />
                        <div className="flex items-center gap-2">
                          <SiX className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="twitterUrl"
                            value={formData.twitterUrl}
                            onChange={(e) => handleInputChange("twitterUrl", e.target.value)}
                            placeholder="https://x.com/yourbowlingalley"
                            data-testid="input-venue-twitter"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <LabelWithTooltip 
                          htmlFor="tikTokUrl" 
                          label="TikTok URL" 
                          tooltip="Your venue's TikTok profile URL. Example: https://tiktok.com/@yourbowlingalley. This helps customers follow you on TikTok."
                        />
                        <div className="flex items-center gap-2">
                          <SiTiktok className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="tikTokUrl"
                            value={formData.tikTokUrl}
                            onChange={(e) => handleInputChange("tikTokUrl", e.target.value)}
                            placeholder="https://tiktok.com/@yourbowlingalley"
                            data-testid="input-venue-tiktok"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <LabelWithTooltip 
                          htmlFor="latitude" 
                          label="Latitude" 
                          tooltip="Geographic coordinate for map display. This is automatically managed by our team to ensure your venue appears correctly on maps."
                        />
                        <Input
                          id="latitude"
                          type="text"
                          inputMode="decimal"
                          value={formData.location.latitude ?? ""}
                          disabled
                          className="bg-muted"
                          data-testid="input-venue-latitude"
                        />
                      </div>
                      <div className="space-y-2">
                        <LabelWithTooltip 
                          htmlFor="longitude" 
                          label="Longitude" 
                          tooltip="Geographic coordinate for map display. This is automatically managed by our team to ensure your venue appears correctly on maps."
                        />
                        <Input
                          id="longitude"
                          type="text"
                          inputMode="decimal"
                          value={formData.location.longitude ?? ""}
                          disabled
                          className="bg-muted"
                          data-testid="input-venue-longitude"
                        />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Operating Hours */}
            <Collapsible open={isHoursOpen} onOpenChange={setIsHoursOpen}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Operating Hours
                      </CardTitle>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${isHoursOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex items-start gap-1.5">
                      <p className="text-sm text-muted-foreground flex-1">
                        Enter hours in a readable format for each day. Use "Closed" for days you're not open.
                      </p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help flex-shrink-0 mt-0.5" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Examples: "Monday: 4:00 PM – 11:00 PM", "Saturday: 10:00 AM – 2:00 AM", or "Tuesday: Closed". Use readable formats that customers can easily understand.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="space-y-2">
                      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
                        <div key={index} className="space-y-1">
                          <Label htmlFor={`hours-${index}`} className="text-xs text-muted-foreground">
                            {day}
                          </Label>
                          <Input
                            id={`hours-${index}`}
                            value={formData.weekdayText[index] || ""}
                            onChange={(e) => {
                              const newWeekdayText = [...formData.weekdayText];
                              newWeekdayText[index] = e.target.value;
                              setFormData((prev) => ({ ...prev, weekdayText: newWeekdayText }));
                            }}
                            placeholder={`e.g., "${day}: 4:00 PM – 11:00 PM" or "Closed"`}
                            data-testid={`input-weekday-text-${index}`}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </TabsContent>

          {/* Tab 2: Photos */}
          <TabsContent value="photos" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Venue Photos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>
                    Venue Photos ({formData.imageUrls.length}/10)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (formData.imageUrls.length < 10) {
                        const newImages = [...formData.imageUrls, ""];
                        setFormData((prev) => ({ ...prev, imageUrls: newImages }));
                      }
                    }}
                    disabled={formData.imageUrls.length >= 10}
                    data-testid="button-add-image"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload up to 10 photos to showcase your bowling alley.
                  {formData.imageUrls.length >= 10 && (
                    <span className="text-orange-600 dark:text-orange-400 font-medium ml-1">
                      Maximum reached.
                    </span>
                  )}
                </p>

                <div className="space-y-4">
                  {formData.imageUrls.map((imageUrl: string, index: number) => (
                    <div key={index} className="relative">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <ImageUploader
                            currentImageUrl={imageUrl}
                            onImageUrlChange={(url) => {
                              const newImages = [...formData.imageUrls];
                              newImages[index] = url;
                              setFormData((prev) => ({
                                ...prev,
                                imageUrls: newImages,
                              }));
                            }}
                            label={`Photo ${index + 1}`}
                            data-testid={`image-selector-additional-${index}`}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newImages = formData.imageUrls.filter(
                              (_: string, i: number) => i !== index,
                            );
                            setFormData((prev) => ({
                              ...prev,
                              imageUrls: newImages,
                            }));
                          }}
                          className="mt-8"
                          data-testid={`button-remove-image-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Resources & Embeds */}
          <TabsContent value="resources" className="space-y-6 mt-6">
            {venue && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Resources & Embeds
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Add these widgets to your website to drive reviews
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Badge Embed */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Review Badge</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const baseUrl = window.location.origin;
                          const embedCode = `<a href="${baseUrl}/venue/${venue.id}" target="_blank" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);color:white;text-decoration:none;border-radius:8px;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;box-shadow:0 2px 8px rgba(220,38,38,0.25);transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px rgba(220,38,38,0.35)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 2px 8px rgba(220,38,38,0.25)';"><span style="font-size:18px;">🎳</span><span>${venue.avgRating > 0 ? '⭐ ' + venue.avgRating.toFixed(1) : 'Rate us'} - ${venue.name}</span></a>`;
                          navigator.clipboard.writeText(embedCode);
                          setCopiedEmbed('badge');
                          setTimeout(() => setCopiedEmbed(null), 2000);
                        }}
                        data-testid="button-copy-badge"
                      >
                        {copiedEmbed === 'badge' ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="p-4 bg-muted rounded-lg border">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: `<a href="${window.location.origin}/venue/${venue.id}" target="_blank" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);color:white;text-decoration:none;border-radius:8px;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;box-shadow:0 2px 8px rgba(220,38,38,0.25);transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px rgba(220,38,38,0.35)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 2px 8px rgba(220,38,38,0.25)';"><span style="font-size:18px;">🎳</span><span>${venue.avgRating > 0 ? '⭐ ' + venue.avgRating.toFixed(1) : 'Rate us'} - ${venue.name}</span></a>`
                        }}
                        className="mb-3"
                      />
                      <p className="text-xs text-muted-foreground">
                        Preview of how the badge will appear on your site
                      </p>
                    </div>
                  </div>

                  {/* Review Widget Embed */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Review Widget</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const baseUrl = window.location.origin;
                          const embedCode = `<div style="max-width:400px;padding:24px;background:linear-gradient(135deg,#dc2626 0%,#991b1b 100%);border-radius:16px;color:white;font-family:system-ui,sans-serif;box-shadow:0 8px 24px rgba(220,38,38,0.3);"><div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;"><span style="font-size:32px;">🎳</span><div style="flex:1;"><h3 style="margin:0 0 4px;font-size:20px;font-weight:700;line-height:1.2;">${venue.name}</h3><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:20px;font-weight:700;">${venue.avgRating > 0 ? '⭐ ' + venue.avgRating.toFixed(1) : '✨ New'}</span><span style="font-size:13px;opacity:0.9;">${venue.reviewCount > 0 ? `(${venue.reviewCount} review${venue.reviewCount !== 1 ? 's' : ''})` : '(Be the first!)'}</span></div></div></div><a href="${baseUrl}/venue/${venue.id}#reviews" target="_blank" style="display:block;width:100%;padding:12px;background:white;color:#dc2626;text-align:center;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;box-shadow:0 2px 6px rgba(0,0,0,0.15);transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.25)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 2px 6px rgba(0,0,0,0.15)';">${venue.reviewCount > 0 ? 'Read Reviews' : 'Leave a Review'}</a></div>`;
                          navigator.clipboard.writeText(embedCode);
                          setCopiedEmbed('widget');
                          setTimeout(() => setCopiedEmbed(null), 2000);
                        }}
                        data-testid="button-copy-widget"
                      >
                        {copiedEmbed === 'widget' ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="p-4 bg-muted rounded-lg border">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: `<div style="max-width:400px;padding:24px;background:linear-gradient(135deg,#dc2626 0%,#991b1b 100%);border-radius:16px;color:white;font-family:system-ui,sans-serif;box-shadow:0 8px 24px rgba(220,38,38,0.3);"><div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;"><span style="font-size:32px;">🎳</span><div style="flex:1;"><h3 style="margin:0 0 4px;font-size:20px;font-weight:700;line-height:1.2;">${venue.name}</h3><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:20px;font-weight:700;">${venue.avgRating > 0 ? '⭐ ' + venue.avgRating.toFixed(1) : '✨ New'}</span><span style="font-size:13px;opacity:0.9;">${venue.reviewCount > 0 ? `(${venue.reviewCount} review${venue.reviewCount !== 1 ? 's' : ''})` : '(Be the first!)'}</span></div></div></div><a href="${window.location.origin}/venue/${venue.id}#reviews" target="_blank" style="display:block;width:100%;padding:12px;background:white;color:#dc2626;text-align:center;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;box-shadow:0 2px 6px rgba(0,0,0,0.15);transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.25)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 2px 6px rgba(0,0,0,0.15)';">${venue.reviewCount > 0 ? 'Read Reviews' : 'Leave a Review'}</a></div>`
                        }}
                        className="mb-3"
                      />
                      <p className="text-xs text-muted-foreground">
                        Preview of how the widget will appear on your site
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            data-testid="button-cancel-venue-form"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            data-testid="button-submit-venue-form"
          >
            {isLoading ? "Saving..." : venue ? "Update Venue" : "Create Venue"}
          </Button>
        </div>
      </form>
    );
  }

  // For admin mode, keep the original single-page layout
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <div className="flex items-center space-x-2 p-2 rounded-md border border-border bg-muted/30">
              <Switch
                id="isFranchise"
                checked={formData.isFranchise}
                onCheckedChange={(checked) =>
                  handleInputChange("isFranchise", checked)
                }
                data-testid="switch-venue-franchise"
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 data-[state=unchecked]:border-gray-400 border"
              />
              <Label
                htmlFor="isFranchise"
                className="text-sm font-medium cursor-pointer"
              >
                Franchise
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Bowling Alley Name"
                required
                data-testid="input-venue-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lanes">Number of Lanes *</Label>
              <Input
                id="lanes"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.lanes}
                onChange={(e) =>
                  handleInputChange("lanes", parseInt(e.target.value) || 1)
                }
                required
                data-testid="input-venue-lanes"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the venue..."
              data-testid="input-venue-description"
            />
          </div>

        </CardContent>
      </Card>

      {/* 2. Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter worst-case scenario pricing (typically Friday/Saturday prime time rates)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceGame">Price per Game ($)</Label>
              <Input
                id="priceGame"
                type="text"
                inputMode="decimal"
                value={formData.pricing.game}
                onChange={(e) =>
                  handleNestedChange(
                    "pricing",
                    "game",
                    parseFloat(e.target.value) || 0,
                  )
                }
                placeholder="5.00"
                data-testid="input-venue-price-game"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceHourly">Hourly Rate ($)</Label>
              <Input
                id="priceHourly"
                type="text"
                inputMode="decimal"
                value={formData.pricing.hourly}
                onChange={(e) =>
                  handleNestedChange(
                    "pricing",
                    "hourly",
                    parseFloat(e.target.value) || 0,
                  )
                }
                placeholder="25.00"
                data-testid="input-venue-price-hourly"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceShoe">Shoe Rental ($)</Label>
              <Input
                id="priceShoe"
                type="text"
                inputMode="decimal"
                value={formData.pricing.shoeRental}
                onChange={(e) =>
                  handleNestedChange(
                    "pricing",
                    "shoeRental",
                    parseFloat(e.target.value) || 0,
                  )
                }
                placeholder="3.00"
                data-testid="input-venue-price-shoe"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Standard Amenity Tags - Clickable */}
          {standardAmenities && standardAmenities.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Select (Recommended)</Label>
              <p className="text-xs text-muted-foreground">
                Most amenities you need are here. Use these standard tags for better search visibility. Hover for details.
              </p>
              <div className="flex flex-wrap gap-2">
                {standardAmenities.map((amenity) => {
                  const isSelected = formData.amenities.includes(amenity.name);
                  const amenitySlug = amenity.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  
                  if (amenity.description) {
                    return (
                      <Tooltip key={amenity.id}>
                        <TooltipTrigger asChild>
                          <span>
                            <Badge
                              variant={isSelected ? "default" : "outline"}
                              className={`cursor-pointer transition-colors ${
                                isSelected 
                                  ? "bg-primary text-primary-foreground" 
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => toggleAmenity(amenity.name)}
                              data-testid={`badge-quick-amenity-${amenitySlug}`}
                            >
                              {isSelected && <Check className="h-3 w-3 mr-1" />}
                              {amenity.name}
                            </Badge>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{amenity.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  return (
                    <Badge
                      key={amenity.id}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleAmenity(amenity.name)}
                      data-testid={`badge-quick-amenity-${amenitySlug}`}
                    >
                      {isSelected && <Check className="h-3 w-3 mr-1" />}
                      {amenity.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {loadingAmenities && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading amenity tags...
            </div>
          )}

          {/* Custom Amenity Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Add Custom Amenity</Label>
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add an amenity (e.g., Arcade, Bar, Pro Shop)"
                data-testid="input-new-amenity"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addAmenity}
                data-testid="button-add-amenity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Selected Amenities */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Selected Amenities ({formData.amenities.length})</Label>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-muted/30 rounded-lg border border-dashed">
              {formData.amenities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No amenities selected</p>
              ) : (
                formData.amenities.map((amenity: string, index: number) => {
                  const isStandard = standardAmenities?.some(sa => sa.name === amenity);
                  return (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="gap-1"
                      data-testid={`badge-selected-amenity-${index}`}
                    >
                      {amenity}
                      {!isStandard && (
                        <span className="text-xs opacity-60">(custom)</span>
                      )}
                      <X
                        className="h-3 w-3 cursor-pointer ml-1"
                        onClick={() => removeAmenity(amenity)}
                        data-testid={`button-remove-amenity-${index}`}
                      />
                    </Badge>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Address, Contact & Location (Collapsible) */}
      <Collapsible open={isAddressOpen} onOpenChange={setIsAddressOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address, Contact & Location
                </CardTitle>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${isAddressOpen ? "rotate-180" : ""}`}
                />
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main Street (optional)"
                  data-testid="input-venue-address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City (optional)"
                    data-testid="input-venue-city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="State (optional)"
                    data-testid="input-venue-state"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    placeholder="12345 (optional)"
                    data-testid="input-venue-zipcode"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    data-testid="input-venue-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="info@bowlingalley.com"
                    data-testid="input-venue-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://bowlingalley.com"
                    data-testid="input-venue-website"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="facebookUrl"
                  className="flex items-center gap-2"
                >
                  <SiFacebook className="h-4 w-4" />
                  Facebook URL
                </Label>
                <Input
                  id="facebookUrl"
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) =>
                    handleInputChange("facebookUrl", e.target.value)
                  }
                  placeholder="https://facebook.com/yourbowlingalley"
                  data-testid="input-venue-facebook"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="instagramUrl"
                  className="flex items-center gap-2"
                >
                  <SiInstagram className="h-4 w-4" />
                  Instagram URL
                </Label>
                <Input
                  id="instagramUrl"
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) =>
                    handleInputChange("instagramUrl", e.target.value)
                  }
                  placeholder="https://instagram.com/yourbowlingalley"
                  data-testid="input-venue-instagram"
                />
              </div>

              {/* Admin-only fields - hidden in owner mode */}
              {!isOwnerMode && (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="claimedByEmail"
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Claimed By (Email)
                    </Label>
                    <Input
                      id="claimedByEmail"
                      type="email"
                      value={formData.claimedByEmail}
                      onChange={(e) =>
                        handleInputChange("claimedByEmail", e.target.value)
                      }
                      placeholder="owner@example.com"
                      data-testid="input-venue-claimed-by-email"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email of the person who has claimed this venue
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="ownerId"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Assign Owner (Registered User)
                    </Label>
                    <Select
                      value={formData.ownerId || "none"}
                      onValueChange={(value) =>
                        handleInputChange(
                          "ownerId",
                          value === "none" ? "" : value,
                        )
                      }
                      disabled={loadingUsers}
                    >
                      <SelectTrigger
                        id="ownerId"
                        data-testid="select-venue-owner"
                      >
                        <SelectValue
                          placeholder={
                            loadingUsers
                              ? "Loading users..."
                              : "Select a registered user"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="z-[2000] bg-background border-border">
                        <SelectItem value="none">None (Clear owner)</SelectItem>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.displayName} ({user.id.substring(0, 8)}...)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {loadingUsers
                        ? "Loading users..."
                        : users?.length
                          ? `Assign a registered user as the owner of this venue. ${users.length} user${users.length !== 1 ? "s" : ""} available.`
                          : "No registered users found. Users who sign up will appear here."}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="text"
                    inputMode="decimal"
                    value={formData.location.latitude || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "location",
                        "latitude",
                        e.target.value ? parseFloat(e.target.value) : null,
                      )
                    }
                    placeholder="31.7619 (optional)"
                    data-testid="input-venue-latitude"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="text"
                    inputMode="decimal"
                    value={formData.location.longitude || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "location",
                        "longitude",
                        e.target.value ? parseFloat(e.target.value) : null,
                      )
                    }
                    placeholder="-106.4850 (optional)"
                    data-testid="input-venue-longitude"
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 5. Operating Hours (Collapsible) */}
      <Collapsible open={isHoursOpen} onOpenChange={setIsHoursOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Operating Hours
                </CardTitle>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${isHoursOpen ? "rotate-180" : ""}`}
                />
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Weekday Text (Human Readable)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Enter hours for each day (e.g., "Monday: 4:00 – 11:00 PM")
                </p>
                {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                  <Input
                    key={index}
                    value={formData.weekdayText[index] || ""}
                    onChange={(e) => {
                      const newWeekdayText = [...formData.weekdayText];
                      newWeekdayText[index] = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        weekdayText: newWeekdayText,
                      }));
                    }}
                    placeholder={`Day ${index}: e.g., "Monday: 4:00 – 11:00 PM"`}
                    data-testid={`input-weekday-text-${index}`}
                  />
                ))}
              </div>

              {/* Admin-only field - periods */}
              {!isOwnerMode && (
                <>
                  <Separator />

                  <div className="space-y-2">
                    <Label>Periods (Structured Data)</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      JSON array of period objects with open/close times
                    </p>
                    <Textarea
                      value={JSON.stringify(formData.periods, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setFormData((prev) => ({ ...prev, periods: parsed }));
                        } catch (err) {
                          // Invalid JSON, don't update
                        }
                      }}
                      placeholder='[{"open": {"day": 1, "time": "1600"}, "close": {"day": 1, "time": "2300"}}]'
                      className="font-mono text-xs min-h-[200px]"
                      data-testid="input-periods"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 6. Resources & Embeds - Owner Mode Only */}
      {isOwnerMode && venue && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Resources & Embeds
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Add these widgets to your website to drive reviews
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Badge Embed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Review Badge</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const baseUrl = window.location.origin;
                    const embedCode = `<a href="${baseUrl}/venue/${venue.id}" target="_blank" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);color:white;text-decoration:none;border-radius:8px;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;box-shadow:0 2px 8px rgba(220,38,38,0.25);transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px rgba(220,38,38,0.35)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 2px 8px rgba(220,38,38,0.25)';"><span style="font-size:18px;">🎳</span><span>${venue.avgRating > 0 ? '⭐ ' + venue.avgRating.toFixed(1) : 'Rate us'} - ${venue.name}</span></a>`;
                    navigator.clipboard.writeText(embedCode);
                    setCopiedEmbed('badge');
                    setTimeout(() => setCopiedEmbed(null), 2000);
                  }}
                  data-testid="button-copy-badge"
                >
                  {copiedEmbed === 'badge' ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-lg border">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: `<a href="${window.location.origin}/venue/${venue.id}" target="_blank" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);color:white;text-decoration:none;border-radius:8px;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;box-shadow:0 2px 8px rgba(220,38,38,0.25);transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px rgba(220,38,38,0.35)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 2px 8px rgba(220,38,38,0.25)';"><span style="font-size:18px;">🎳</span><span>${venue.avgRating > 0 ? '⭐ ' + venue.avgRating.toFixed(1) : 'Rate us'} - ${venue.name}</span></a>`
                  }}
                  className="mb-3"
                />
                <p className="text-xs text-muted-foreground">
                  Preview of how the badge will appear on your site
                </p>
              </div>
            </div>

            {/* Review Widget Embed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Review Widget</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const baseUrl = window.location.origin;
                    const embedCode = `<div style="max-width:400px;padding:24px;background:linear-gradient(135deg,#dc2626 0%,#991b1b 100%);border-radius:16px;color:white;font-family:system-ui,sans-serif;box-shadow:0 8px 24px rgba(220,38,38,0.3);"><div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;"><span style="font-size:32px;">🎳</span><div style="flex:1;"><h3 style="margin:0 0 4px;font-size:20px;font-weight:700;line-height:1.2;">${venue.name}</h3><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:20px;font-weight:700;">${venue.avgRating > 0 ? '⭐ ' + venue.avgRating.toFixed(1) : '✨ New'}</span><span style="font-size:13px;opacity:0.9;">${venue.reviewCount > 0 ? `(${venue.reviewCount} review${venue.reviewCount !== 1 ? 's' : ''})` : '(Be the first!)'}</span></div></div></div><a href="${baseUrl}/venue/${venue.id}#reviews" target="_blank" style="display:block;width:100%;padding:12px;background:white;color:#dc2626;text-align:center;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;box-shadow:0 2px 6px rgba(0,0,0,0.15);transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.25)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 2px 6px rgba(0,0,0,0.15)';">${venue.reviewCount > 0 ? 'Read Reviews' : 'Leave a Review'}</a></div>`;
                    navigator.clipboard.writeText(embedCode);
                    setCopiedEmbed('widget');
                    setTimeout(() => setCopiedEmbed(null), 2000);
                  }}
                  data-testid="button-copy-widget"
                >
                  {copiedEmbed === 'widget' ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-lg border">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: `<div style="max-width:400px;padding:24px;background:linear-gradient(135deg,#dc2626 0%,#991b1b 100%);border-radius:16px;color:white;font-family:system-ui,sans-serif;box-shadow:0 8px 24px rgba(220,38,38,0.3);"><div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;"><span style="font-size:32px;">🎳</span><div style="flex:1;"><h3 style="margin:0 0 4px;font-size:20px;font-weight:700;line-height:1.2;">${venue.name}</h3><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:20px;font-weight:700;">${venue.avgRating > 0 ? '⭐ ' + venue.avgRating.toFixed(1) : '✨ New'}</span><span style="font-size:13px;opacity:0.9;">${venue.reviewCount > 0 ? `(${venue.reviewCount} review${venue.reviewCount !== 1 ? 's' : ''})` : '(Be the first!)'}</span></div></div></div><a href="${window.location.origin}/venue/${venue.id}#reviews" target="_blank" style="display:block;width:100%;padding:12px;background:white;color:#dc2626;text-align:center;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;box-shadow:0 2px 6px rgba(0,0,0,0.15);transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.25)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 2px 6px rgba(0,0,0,0.15)';">${venue.reviewCount > 0 ? 'Read Reviews' : 'Leave a Review'}</a></div>`
                  }}
                  className="mb-3"
                />
                <p className="text-xs text-muted-foreground">
                  Preview of how the widget will appear on your site
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          data-testid="button-cancel-venue-form"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          data-testid="button-submit-venue-form"
        >
          {isLoading ? "Saving..." : venue ? "Update Venue" : "Create Venue"}
        </Button>
      </div>

      {/* Pricing Period Drawer */}
      <PricingPeriodDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        period={editingPeriod}
        onSave={handleSavePeriod}
      />
    </form>
  );
}
