import { useState, useRef } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import html2canvas from "html2canvas";
import {
  Download,
  Plus,
  ChevronUp,
  ChevronDown,
  Layers,
  GripVertical,
  Trash2,
  Pencil,
  Check,
  X,
  RotateCcw,
  ZoomIn,
  RotateCw,
  Upload,
  Image,
} from "lucide-react";
import { trackEvent, trackEventWithUser } from "@/lib/analytics";
import { useAuth } from "@/lib/auth";
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
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  logoAssets,
  getAssetsByCategory,
  type LogoAsset,
} from "@/lib/logoAssets";

type LogoLayer = {
  id: string;
  assetId: string | null; // null for text/image layers
  category: LogoAsset["category"] | "text" | "image";
  x: number;
  y: number;
  scale: number;
  rotation: number;
  customName?: string;
  textContent?: string; // for text layers
  imageUrl?: string; // for uploaded image layers (data URL)
  fontFamily?: string; // for text layers
  textColor?: string; // for text layers
};

const FONT_OPTIONS = [
  { value: "Impact, sans-serif", label: "Impact" },
  { value: "'Anton', sans-serif", label: "Anton" },
  { value: "'Bebas Neue', sans-serif", label: "Bebas Neue" },
  { value: "'Luckiest Guy', cursive", label: "Luckiest Guy" },
  { value: "'Oswald', sans-serif", label: "Oswald" },
  { value: "'Permanent Marker', cursive", label: "Permanent Marker" },
] as const;

const COLOR_PRESETS = [
  "#ffffff",
  "#000000",
  "#ff0000",
  "#ff6600",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0066ff",
  "#9900ff",
  "#ff00ff",
  "#ff69b4",
  "#ffd700",
  "#c0c0c0",
  "#8b4513",
  "#1a1a1a",
];

const CATEGORIES: LogoAsset["category"][] = [
  "main",
  "decoration",
  "baio",
  "holidays",
];

function generateLayerId(): string {
  return `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getDefaultPosition(category: LogoAsset["category"]): {
  x: number;
  y: number;
  scale: number;
  rotation: number;
} {
  switch (category) {
    case "main":
      return { x: 50, y: 45, scale: 1, rotation: 0 };
    case "decoration":
      return { x: 50, y: 50, scale: 0.6, rotation: 0 };
    case "baio":
      return { x: 50, y: 50, scale: 0.5, rotation: 0 };
    case "holidays":
      return { x: 50, y: 50, scale: 0.6, rotation: 0 };
    default:
      return { x: 50, y: 50, scale: 0.7, rotation: 0 };
  }
}

export default function TeamLogoLab() {
  const { user } = useAuth();
  const [layers, setLayers] = useState<LogoLayer[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [newTextInput, setNewTextInput] = useState("");
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [editingLayerName, setEditingLayerName] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState("");
  const [draggingAsset, setDraggingAsset] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null);
  const [dragOverLayer, setDragOverLayer] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<"white" | "black">("black");
  const logoRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAssetById = (assetId: string): LogoAsset | undefined => {
    return logoAssets.find((a) => a.id === assetId);
  };

  const addLayer = (asset: LogoAsset) => {
    const defaultPos = getDefaultPosition(asset.category);
    const newLayer: LogoLayer = {
      id: generateLayerId(),
      assetId: asset.id,
      category: asset.category,
      ...defaultPos,
    };

    // Track layer addition
    trackEvent("logo_lab_add_layer", "Logo Lab", asset.category);

    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const updateSelectedLayer = (updates: Partial<LogoLayer>) => {
    if (!selectedLayerId) return;
    setLayers((prev) =>
      prev.map((l) => (l.id === selectedLayerId ? { ...l, ...updates } : l)),
    );
  };

  const deleteLayer = (layerId: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== layerId));
    if (selectedLayerId === layerId) {
      setSelectedLayerId(null);
    }
  };

  const clearAllLayers = () => {
    trackEvent("logo_lab_clear_all", "Logo Lab", undefined, layers.length);
    setLayers([]);
    setSelectedLayerId(null);
  };

  const addTextLayer = (text: string) => {
    if (!text.trim()) return;

    // Track text layer addition
    trackEvent("logo_lab_add_text", "Logo Lab", "text");

    const newLayer: LogoLayer = {
      id: generateLayerId(),
      assetId: null,
      category: "text",
      x: 50,
      y: 75,
      scale: 1,
      rotation: 0,
      textContent: text.trim(),
      customName: text.trim().slice(0, 20),
      fontFamily: "Impact, sans-serif",
      textColor: "#ffffff",
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    setNewTextInput("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, etc.)");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Please use an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      // Track image upload
      trackEvent("logo_lab_upload_image", "Logo Lab", "image");

      const newLayer: LogoLayer = {
        id: generateLayerId(),
        assetId: null,
        category: "image",
        x: 50,
        y: 50,
        scale: 0.8,
        rotation: 0,
        imageUrl: dataUrl,
        customName: file.name.replace(/\.[^/.]+$/, "").slice(0, 20),
      };
      setLayers((prev) => [...prev, newLayer]);
      setSelectedLayerId(newLayer.id);
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const moveLayerUp = (layerId: string) => {
    setLayers((prev) => {
      const index = prev.findIndex((l) => l.id === layerId);
      if (index < prev.length - 1) {
        const newLayers = [...prev];
        [newLayers[index], newLayers[index + 1]] = [
          newLayers[index + 1],
          newLayers[index],
        ];
        return newLayers;
      }
      return prev;
    });
  };

  const moveLayerDown = (layerId: string) => {
    setLayers((prev) => {
      const index = prev.findIndex((l) => l.id === layerId);
      if (index > 0) {
        const newLayers = [...prev];
        [newLayers[index], newLayers[index - 1]] = [
          newLayers[index - 1],
          newLayers[index],
        ];
        return newLayers;
      }
      return prev;
    });
  };

  const startEditingName = (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    const asset = layer?.assetId ? getAssetById(layer.assetId) : null;
    setEditingLayerName(layerId);
    const defaultName = asset ? asset.name : layer?.textContent || "";
    setEditingNameValue(layer?.customName || defaultName);
  };

  const saveLayerName = () => {
    if (!editingLayerName) return;
    setLayers((prev) =>
      prev.map((l) =>
        l.id === editingLayerName
          ? { ...l, customName: editingNameValue.trim() || undefined }
          : l,
      ),
    );
    setEditingLayerName(null);
    setEditingNameValue("");
  };

  const cancelEditingName = () => {
    setEditingLayerName(null);
    setEditingNameValue("");
  };

  const handleDragStart = (layerId: string) => {
    setDraggedLayer(layerId);
  };

  const handleDragOver = (e: React.DragEvent, layerId: string) => {
    e.preventDefault();
    if (draggedLayer && draggedLayer !== layerId) {
      setDragOverLayer(layerId);
    }
  };

  const handleDragLeave = () => {
    setDragOverLayer(null);
  };

  const handleDrop = (targetLayerId: string) => {
    if (!draggedLayer || draggedLayer === targetLayerId) {
      setDraggedLayer(null);
      setDragOverLayer(null);
      return;
    }

    setLayers((prev) => {
      const newLayers = [...prev];
      const draggedIndex = newLayers.findIndex((l) => l.id === draggedLayer);
      const targetIndex = newLayers.findIndex((l) => l.id === targetLayerId);
      const [removed] = newLayers.splice(draggedIndex, 1);
      newLayers.splice(targetIndex, 0, removed);
      return newLayers;
    });

    setDraggedLayer(null);
    setDragOverLayer(null);
  };

  const handleDragEnd = () => {
    setDraggedLayer(null);
    setDragOverLayer(null);
  };

  const handlePreviewMouseDown = (e: React.MouseEvent) => {
    if (selectedLayerId) {
      e.preventDefault();
      setDraggingAsset(selectedLayerId);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePreviewMouseMove = (e: React.MouseEvent) => {
    if (!draggingAsset || !dragStart || !logoRef.current) return;

    const rect = logoRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    setLayers((prev) =>
      prev.map((l) => {
        if (l.id === draggingAsset) {
          return {
            ...l,
            x: Math.max(0, Math.min(100, l.x + deltaX)),
            y: Math.max(0, Math.min(100, l.y + deltaY)),
          };
        }
        return l;
      }),
    );

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePreviewMouseUp = () => {
    setDraggingAsset(null);
    setDragStart(null);
  };

  const downloadPng = async () => {
    if (!logoRef.current) return;

    setIsDownloading(true);

    // Temporarily hide watermark and remove selection outlines
    const watermark = logoRef.current.querySelector(
      ".absolute.bottom-2",
    ) as HTMLElement;
    const selectedElements =
      logoRef.current.querySelectorAll('[style*="outline"]');

    if (watermark) watermark.style.display = "none";
    selectedElements.forEach((el) => {
      (el as HTMLElement).style.outline = "none";
    });

    try {
      const canvas = await html2canvas(logoRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
      });

      // Create download link
      const link = document.createElement("a");
      link.download = "bowling-team-logo.png";
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Track successful download with user info
      trackEventWithUser(
        "logo_lab_download",
        user?.uid,
        user?.email || undefined,
        "Logo Lab",
        "png",
        layers.length,
      );
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      // Restore watermark
      if (watermark) watermark.style.display = "";
      setIsDownloading(false);
    }
  };

  const getLayerDisplayName = (layer: LogoLayer): string => {
    if (layer.customName) return layer.customName;
    if (layer.category === "text")
      return layer.textContent?.slice(0, 15) || "Text";
    if (layer.category === "image") return "Uploaded Image";
    const asset = layer.assetId ? getAssetById(layer.assetId) : null;
    return asset?.name || "Layer";
  };

  const getCategoryColor = (
    category: LogoAsset["category"] | "text" | "image",
  ): string => {
    switch (category) {
      case "main":
        return "bg-blue-500/20 text-blue-300";
      case "decoration":
        return "bg-green-500/20 text-green-300";
      case "text":
        return "bg-pink-500/20 text-pink-300";
      case "image":
        return "bg-cyan-500/20 text-cyan-300";
      case "baio":
        return "bg-yellow-500/20 text-yellow-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <Helmet>
        <title>Bowling Team Logo Lab | BowlingAlleys.io</title>
        <meta
          name="description"
          content="Create a custom bowling team logo in seconds! Choose your layers, enter your team name, and build a unique logo. Free bowling team logo generator."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Bowling Team Logo Lab | BowlingAlleys.io"
        />
        <meta
          property="og:description"
          content="Create a custom bowling team logo in seconds! Choose your layers, enter your team name, and build a unique logo. Free bowling team logo generator."
        />
        <meta property="og:url" content="https://bowlingalleys.io/logo-lab" />
        <meta property="og:site_name" content="BowlingAlleys.io" />
        <meta
          property="og:image"
          content="https://bowlingalleys.io/og-logo-lab.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Bowling Team Logo Lab | BowlingAlleys.io"
        />
        <meta
          name="twitter:description"
          content="Create a custom bowling team logo in seconds! Choose your layers, enter your team name, and build a unique logo. Free bowling team logo generator."
        />
        <meta
          name="twitter:image"
          content="https://bowlingalleys.io/og-logo-lab.png"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Luckiest+Guy&family=Oswald:wght@700&family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Bowling Team Logo Lab
              </h1>
              <p className="text-muted-foreground">
                Build your bowling team logo layer by layer. Add backgrounds,
                main elements, accents, and decorations!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Controls */}
              <Card className="p-6">
                <div className="space-y-6">
                  {/* Upload Image */}
                  <div className="space-y-2">
                    <Label>Upload Your Own Image</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      data-testid="input-file-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                      data-testid="button-upload-image"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload PNG / Image
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Add your own graphics, stickers, or designs (max 5MB)
                    </p>
                  </div>

                  {/* Add Text Layer */}
                  <div className="space-y-2">
                    <Label htmlFor="add-text">Add Text / Emoji</Label>
                    <div className="flex gap-2">
                      <Input
                        id="add-text"
                        placeholder="Team name, emoji, text..."
                        value={newTextInput}
                        onChange={(e) => setNewTextInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && addTextLayer(newTextInput)
                        }
                        data-testid="input-add-text"
                      />
                      <Button
                        onClick={() => addTextLayer(newTextInput)}
                        disabled={!newTextInput.trim()}
                        data-testid="button-add-text"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add any text, team names, or emojis as layers
                    </p>
                  </div>

                  {/* Category Tabs for Adding Layers */}
                  <div className="space-y-2">
                    <Label>Add Layers</Label>
                    <Tabs defaultValue="baio" className="w-full">
                      <TabsList className="w-full grid grid-cols-4">
                        {CATEGORIES.map((cat) => (
                          <TabsTrigger
                            key={cat}
                            value={cat}
                            className="text-xs"
                          >
                            {cat === "baio"
                              ? "BAiO"
                              : cat === "holidays"
                                ? "Holidays"
                                : cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {CATEGORIES.map((category) => (
                        <TabsContent
                          key={category}
                          value={category}
                          className="mt-2"
                        >
                          <ScrollArea className="h-[140px]">
                            <div className="grid grid-cols-3 gap-2 p-1">
                              {getAssetsByCategory(category).map((asset) => (
                                <button
                                  key={asset.id}
                                  onClick={() => addLayer(asset)}
                                  className="aspect-square rounded-md bg-muted/50 border border-border p-2 hover-elevate active-elevate-2 transition-all flex items-center justify-center group relative"
                                  title={asset.name}
                                  data-testid={`button-add-${asset.id}`}
                                >
                                  <div className="w-full h-full">
                                    {asset.svg}
                                  </div>
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                    <Plus className="w-6 h-6 text-white" />
                                  </div>
                                </button>
                              ))}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>

                  {/* Clear All Button */}
                  {layers.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearAllLayers}
                      className="w-full"
                      data-testid="button-clear-all"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  )}

                  {/* Layers Panel */}
                  {layers.length > 0 && (
                    <div className="pt-4 space-y-3 border-t">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        <Label>Layers ({layers.length})</Label>
                      </div>
                      <div className="space-y-1 max-h-[200px] overflow-y-auto">
                        {[...layers].reverse().map((layer, index) => {
                          const asset = layer.assetId
                            ? getAssetById(layer.assetId)
                            : null;
                          if (
                            !asset &&
                            layer.category !== "text" &&
                            layer.category !== "image"
                          )
                            return null;
                          const isTop = index === 0;
                          const isBottom = index === layers.length - 1;
                          const isDragging = draggedLayer === layer.id;
                          const isDragOver = dragOverLayer === layer.id;
                          const isEditing = editingLayerName === layer.id;
                          const isSelected = selectedLayerId === layer.id;
                          const displayName = getLayerDisplayName(layer);

                          return (
                            <div
                              key={layer.id}
                              draggable={!isEditing}
                              onDragStart={() =>
                                !isEditing && handleDragStart(layer.id)
                              }
                              onDragOver={(e) => handleDragOver(e, layer.id)}
                              onDragLeave={handleDragLeave}
                              onDrop={() => handleDrop(layer.id)}
                              onDragEnd={handleDragEnd}
                              onClick={() =>
                                !isEditing && setSelectedLayerId(layer.id)
                              }
                              className={`flex items-center justify-between p-2 rounded border transition-all ${
                                isEditing ? "" : "cursor-pointer"
                              } ${
                                isDragging ? "opacity-50 border-primary" : ""
                              } ${
                                isDragOver ? "border-primary bg-primary/10" : ""
                              } ${isSelected ? "ring-2 ring-primary bg-primary/5" : "bg-muted/30"}`}
                              data-testid={`layer-${layer.id}`}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 cursor-grab" />
                                <Badge
                                  variant="secondary"
                                  className={`text-[10px] px-1.5 py-0 ${getCategoryColor(layer.category)}`}
                                >
                                  {layer.category.charAt(0).toUpperCase()}
                                </Badge>
                                {isEditing ? (
                                  <div className="flex items-center gap-1 flex-1">
                                    <Input
                                      value={editingNameValue}
                                      onChange={(e) =>
                                        setEditingNameValue(e.target.value)
                                      }
                                      className="h-6 text-sm px-1"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") saveLayerName();
                                        if (e.key === "Escape")
                                          cancelEditingName();
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      data-testid={`input-layer-name-${layer.id}`}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 shrink-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        saveLayerName();
                                      }}
                                    >
                                      <Check className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 shrink-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        cancelEditingName();
                                      }}
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-sm truncate">
                                    {displayName}
                                  </span>
                                )}
                              </div>
                              {!isEditing && (
                                <div className="flex gap-0.5 shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEditingName(layer.id);
                                    }}
                                    title="Rename"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveLayerUp(layer.id);
                                    }}
                                    disabled={isTop}
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveLayerDown(layer.id);
                                    }}
                                    disabled={isBottom}
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteLayer(layer.id);
                                    }}
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tips */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium mb-3">Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Browse categories and click assets to add layers</li>
                    <li>
                      • Click layer chips in the preview to select and edit
                    </li>
                    <li>• Drag in the preview to move selected layers</li>
                    <li>• Use the toolbar for size, rotation, and delete</li>
                  </ul>
                </div>
              </Card>

              {/* Right Column - Preview */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Preview</h2>

                {/* Layer Chips - Horizontal scrollable strip */}
                {layers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Click a layer to select and edit:
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {layers.map((layer) => {
                        const asset = layer.assetId
                          ? getAssetById(layer.assetId)
                          : null;
                        const isSelected = selectedLayerId === layer.id;
                        return (
                          <button
                            key={layer.id}
                            onClick={() =>
                              setSelectedLayerId(isSelected ? null : layer.id)
                            }
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border shrink-0 transition-all ${
                              isSelected
                                ? "bg-primary/20 border-primary ring-2 ring-primary/50"
                                : "bg-muted/50 border-border hover-elevate"
                            }`}
                            data-testid={`chip-layer-${layer.id}`}
                          >
                            <div className="w-6 h-6 rounded overflow-hidden bg-black/20 flex items-center justify-center text-xs">
                              {layer.category === "text" ? (
                                "Aa"
                              ) : layer.category === "image" &&
                                layer.imageUrl ? (
                                <img
                                  src={layer.imageUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                asset?.svg
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {getLayerDisplayName(layer)}
                            </span>
                            <Badge
                              variant="secondary"
                              className={`text-[10px] px-1.5 py-0 ${getCategoryColor(layer.category)}`}
                            >
                              {layer.category.charAt(0).toUpperCase()}
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Logo Preview Container */}
                <div
                  ref={logoRef}
                  className={`aspect-square w-full max-w-[512px] mx-auto rounded-xl overflow-hidden relative ${
                    selectedLayerId ? "cursor-move" : ""
                  } ${bgColor === "white" ? "border" : ""}`}
                  style={{
                    backgroundColor: bgColor === "white" ? "#fff" : "#000",
                  }}
                  onMouseDown={handlePreviewMouseDown}
                  onMouseMove={handlePreviewMouseMove}
                  onMouseUp={handlePreviewMouseUp}
                  onMouseLeave={handlePreviewMouseUp}
                  data-testid="logo-preview"
                >
                  {layers.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white/50 text-center px-8">
                        Add layers from the categories to build your logo
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Render Layers */}
                      {layers.map((layer, index) => {
                        const isDraggingThis = draggingAsset === layer.id;
                        const isSelected = selectedLayerId === layer.id;

                        // Handle text layers
                        if (layer.category === "text") {
                          const textContent = layer.textContent || "";
                          const fontSize =
                            textContent.length > 15
                              ? "1.5rem"
                              : textContent.length > 10
                                ? "2rem"
                                : "2.5rem";
                          return (
                            <div
                              key={layer.id}
                              className="absolute pointer-events-none text-center"
                              style={{
                                left: `${layer.x}%`,
                                top: `${layer.y}%`,
                                transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                                zIndex: isDraggingThis ? 100 : index + 1,
                                opacity: isDraggingThis ? 0.8 : 1,
                                outline: isSelected
                                  ? "2px dashed rgba(59,130,246,0.8)"
                                  : "none",
                                outlineOffset: "4px",
                                width: "90%",
                              }}
                              data-testid={`asset-${layer.id}`}
                            >
                              <span
                                className="font-bold uppercase tracking-wide"
                                style={{
                                  fontFamily:
                                    layer.fontFamily || "Impact, sans-serif",
                                  fontSize,
                                  color: layer.textColor || "#fff",
                                  textShadow:
                                    "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
                                  letterSpacing: "0.1em",
                                }}
                              >
                                {textContent}
                              </span>
                            </div>
                          );
                        }

                        // Handle image layers
                        if (layer.category === "image" && layer.imageUrl) {
                          return (
                            <div
                              key={layer.id}
                              className="absolute pointer-events-none"
                              style={{
                                left: `${layer.x}%`,
                                top: `${layer.y}%`,
                                width: "70%",
                                height: "70%",
                                transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                                zIndex: isDraggingThis ? 100 : index + 1,
                                opacity: isDraggingThis ? 0.8 : 1,
                                outline: isSelected
                                  ? "2px dashed rgba(59,130,246,0.8)"
                                  : "none",
                                outlineOffset: "4px",
                              }}
                              data-testid={`asset-${layer.id}`}
                            >
                              <img
                                src={layer.imageUrl}
                                alt="Uploaded layer"
                                className="w-full h-full object-contain"
                                draggable={false}
                              />
                            </div>
                          );
                        }

                        // Handle asset layers
                        const asset = layer.assetId
                          ? getAssetById(layer.assetId)
                          : null;
                        if (!asset) return null;

                        const size = "60%";

                        return (
                          <div
                            key={layer.id}
                            className="absolute pointer-events-none"
                            style={{
                              left: `${layer.x}%`,
                              top: `${layer.y}%`,
                              width: size,
                              height: size,
                              transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                              zIndex: isDraggingThis ? 100 : index + 1,
                              opacity: isDraggingThis ? 0.8 : 1,
                              outline: isSelected
                                ? "2px dashed rgba(59,130,246,0.8)"
                                : "none",
                              outlineOffset: "4px",
                            }}
                            data-testid={`asset-${layer.id}`}
                          >
                            {asset.svg}
                          </div>
                        );
                      })}

                      {/* Watermark */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50">
                        <span
                          className="text-white/30 text-xs"
                          style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                          bowlingalleys.io
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Transform Toolbar - Shows when layer is selected */}
                {selectedLayerId &&
                  (() => {
                    const layer = layers.find((l) => l.id === selectedLayerId);
                    if (!layer) return null;
                    const scalePresets = [0.5, 0.75, 1, 1.25, 1.5];
                    return (
                      <Card className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">
                            Editing: {getLayerDisplayName(layer)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLayerId(null)}
                            className="text-xs"
                          >
                            Done
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {/* Scale Control */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm flex items-center gap-2">
                                <ZoomIn className="w-4 h-4" /> Size
                              </Label>
                              <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                                {Math.round(layer.scale * 100)}%
                              </span>
                            </div>
                            <Slider
                              value={[layer.scale]}
                              onValueChange={([value]) =>
                                updateSelectedLayer({ scale: value })
                              }
                              min={0.2}
                              max={2}
                              step={0.05}
                              className="w-full"
                              data-testid="slider-scale-toolbar"
                            />
                            <div className="flex gap-1">
                              {scalePresets.map((preset) => (
                                <Button
                                  key={preset}
                                  variant={
                                    Math.abs(layer.scale - preset) < 0.01
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() =>
                                    updateSelectedLayer({ scale: preset })
                                  }
                                >
                                  {preset * 100}%
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Rotation Control */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm flex items-center gap-2">
                                <RotateCw className="w-4 h-4" /> Rotation
                              </Label>
                              <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                                {layer.rotation}°
                              </span>
                            </div>
                            <Slider
                              value={[layer.rotation]}
                              onValueChange={([value]) =>
                                updateSelectedLayer({ rotation: value })
                              }
                              min={-180}
                              max={180}
                              step={5}
                              className="w-full"
                              data-testid="slider-rotation-toolbar"
                            />
                            <div className="flex gap-1">
                              {[-90, -45, 0, 45, 90].map((deg) => (
                                <Button
                                  key={deg}
                                  variant={
                                    layer.rotation === deg
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() =>
                                    updateSelectedLayer({ rotation: deg })
                                  }
                                >
                                  {deg}°
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Text Styling - Only show for text layers */}
                          {layer.category === "text" && (
                            <>
                              {/* Font Selection */}
                              <div className="space-y-2">
                                <Label className="text-sm">Font</Label>
                                <div className="grid grid-cols-2 gap-1">
                                  {FONT_OPTIONS.map((font) => (
                                    <button
                                      key={font.value}
                                      onClick={() =>
                                        updateSelectedLayer({
                                          fontFamily: font.value,
                                        })
                                      }
                                      className={`px-2 py-1.5 text-sm rounded-md border transition-all text-left truncate ${
                                        layer.fontFamily === font.value
                                          ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                                          : "border-border hover-elevate"
                                      }`}
                                      style={{ fontFamily: font.value }}
                                      data-testid={`button-font-${font.label.toLowerCase().replace(/\s/g, "-")}`}
                                    >
                                      {font.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Color Selection */}
                              <div className="space-y-2">
                                <Label className="text-sm">Text Color</Label>
                                <div className="flex flex-wrap gap-1">
                                  {COLOR_PRESETS.map((color) => (
                                    <button
                                      key={color}
                                      onClick={() =>
                                        updateSelectedLayer({
                                          textColor: color,
                                        })
                                      }
                                      className={`w-7 h-7 rounded-md border-2 transition-all ${
                                        layer.textColor === color
                                          ? "border-primary ring-2 ring-primary/30"
                                          : "border-border"
                                      }`}
                                      style={{ backgroundColor: color }}
                                      title={color}
                                      data-testid={`button-color-${color.replace("#", "")}`}
                                    />
                                  ))}
                                </div>
                                <div className="flex gap-2 items-center">
                                  <Input
                                    type="text"
                                    value={layer.textColor || "#ffffff"}
                                    onChange={(e) =>
                                      updateSelectedLayer({
                                        textColor: e.target.value,
                                      })
                                    }
                                    placeholder="#ffffff"
                                    className="font-mono text-sm"
                                    data-testid="input-color-hex"
                                  />
                                  <input
                                    type="color"
                                    value={layer.textColor || "#ffffff"}
                                    onChange={(e) =>
                                      updateSelectedLayer({
                                        textColor: e.target.value,
                                      })
                                    }
                                    className="w-10 h-9 rounded cursor-pointer border-0"
                                    data-testid="input-color-picker"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {/* Delete Button */}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteLayer(layer.id)}
                            className="w-full"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Layer
                          </Button>
                        </div>
                      </Card>
                    );
                  })()}

                {/* Instructions when no layer selected */}
                {!selectedLayerId && (
                  <div className="text-center text-sm text-muted-foreground py-2">
                    {layers.length === 0 ? (
                      <p>
                        Choose assets from the categories on the left to start
                        building
                      </p>
                    ) : (
                      <p>Click a layer chip above to select and edit it</p>
                    )}
                  </div>
                )}

                {/* Background Toggle & Download */}
                {layers.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Background:
                      </span>
                      <button
                        onClick={() => setBgColor("black")}
                        className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                          bgColor === "black"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover-elevate"
                        }`}
                        data-testid="button-bg-black"
                      >
                        Black
                      </button>
                      <button
                        onClick={() => setBgColor("white")}
                        className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                          bgColor === "white"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover-elevate"
                        }`}
                        data-testid="button-bg-white"
                      >
                        White
                      </button>
                    </div>

                    {/* Download Button */}
                    <Button
                      variant="default"
                      onClick={downloadPng}
                      disabled={isDownloading}
                      className="w-full"
                      data-testid="button-download"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isDownloading ? "Downloading..." : "Download your logo"}
                    </Button>
                  </div>
                )}

                {/* Quick Add Strip */}
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    Quick add:
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {logoAssets.slice(0, 8).map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => addLayer(asset)}
                        className="w-10 h-10 shrink-0 rounded bg-muted/50 border p-1 hover-elevate"
                        title={asset.name}
                      >
                        {asset.svg}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Back Link */}
            <div className="text-center mt-12">
              <Link href="/">
                <Button variant="ghost" data-testid="link-back-home">
                  Back to BowlingAlleys.io
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
