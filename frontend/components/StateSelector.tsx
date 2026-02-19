'use client';

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StateSelectorProps {
  states: string[];
  isLoading: boolean;
  onStateClick: (state: string) => void;
  getHref?: (state: string) => string;
  icon?: string | React.ReactNode;
  testIdPrefix?: string;
  description?: string;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  emptyStateIcon?: string | React.ReactNode;
  enableSearch?: boolean;
  searchPlaceholder?: string;
}

export default function StateSelector({
  states,
  isLoading,
  onStateClick,
  getHref,
  icon,
  testIdPrefix = "state",
  description = "Click to browse venues",
  emptyStateTitle = "No states found",
  emptyStateMessage = "No locations available at the moment.",
  emptyStateIcon,
  enableSearch = true,
  searchPlaceholder = "Search locations...",
}: StateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const createSlug = (text: string) =>
    text.toLowerCase().replace(/\s+/g, "-");

  const filteredStates = useMemo(() => {
    if (!searchTerm.trim() || !enableSearch) return states;

    const searchLower = searchTerm.toLowerCase();
    return states.filter((state) => state.toLowerCase().includes(searchLower));
  }, [states, searchTerm, enableSearch]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {enableSearch && (
          <div className="relative max-w-md">
            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="p-4">
                <div className="h-5 bg-muted rounded w-24 mb-2"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (states.length === 0) {
    return (
      <div className="text-center py-16">
        {emptyStateIcon && <div className="text-6xl mb-4">{emptyStateIcon}</div>}
        <h3 className="text-lg font-semibold mb-2">{emptyStateTitle}</h3>
        <p className="text-muted-foreground">{emptyStateMessage}</p>
      </div>
    );
  }

  const displayStates = filteredStates;
  const showNoResults = enableSearch && searchTerm && displayStates.length === 0;

  const cardContent = (state: string) => (
    <CardContent className="p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {icon && (
            <div className="text-xl flex-shrink-0" aria-hidden="true">
              {icon}
            </div>
          )}
          <h3 className="font-semibold text-base truncate min-w-0">{state}</h3>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </div>
    </CardContent>
  );

  return (
    <div className="space-y-6">
      {enableSearch && (
        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
              data-testid="input-state-search"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                data-testid="button-clear-state-search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              {searchTerm ? (
                <>
                  Showing {displayStates.length} of {states.length}{" "}
                  {displayStates.length === 1 ? "location" : "locations"}
                </>
              ) : (
                <>
                  {states.length} {states.length === 1 ? "location" : "locations"}{" "}
                  available
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {showNoResults ? (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No locations found</h3>
          <p className="text-muted-foreground mb-4">
            No locations match "{searchTerm}"
          </p>
          <Button variant="outline" onClick={() => setSearchTerm("")}>
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {displayStates.map((state) =>
            getHref ? (
              <Link
                key={state}
                href={getHref(state)}
                data-testid={`card-${testIdPrefix}-${createSlug(state)}`}
              >
                <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all duration-200 h-full">
                  {cardContent(state)}
                </Card>
              </Link>
            ) : (
              <Card
                key={state}
                className="hover-elevate active-elevate-2 cursor-pointer transition-all duration-200 h-full"
                onClick={() => onStateClick(state)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onStateClick(state);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${state} - ${description}`}
                data-testid={`card-${testIdPrefix}-${createSlug(state)}`}
              >
                {cardContent(state)}
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}
