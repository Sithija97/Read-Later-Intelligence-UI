import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useCreateItem } from "@/services/queries";
import { ApiError } from "@/services/api";

const SaveLinkForm = () => {
  const navigate = useNavigate();
  const createItemMutation = useCreateItem();
  const [isClient, setIsClient] = useState(true);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Hydration: switch to pre-client state
    setIsClient(false);

    // Client-side initialization
    const tick = () => {
      // Restore to client state
      setIsClient(true);
    };

    // Use requestAnimationFrame for smooth transition
    const rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error
    setError("");

    // Validate URL
    if (!url.trim()) {
      setError("Please paste an article URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      // Create item via API
      const response = await createItemMutation.mutateAsync({ url });
      console.log("Item created:", response);

      // Store item data in sessionStorage for processing state to access
      if (typeof window !== "undefined") {
        // sessionStorage.setItem("articleUrl", url);
        // sessionStorage.setItem("itemId", response.data.id);
        // sessionStorage.setItem("itemStatus", response.data.status);
        navigate("/loading");
      }
    } catch (err) {
      // Handle API errors
      if (err instanceof ApiError) {
        setError((err.data as { message?: string })?.message || (err instanceof Error ? err.message : '') || `Error: ${err.status} ${err.statusText}`);
      } else {
        setError("Failed to save article. Please try again.");
      }
      console.error("Create item failed:", err);
    }
  };

  return (
    <div
      className={cn(
        "transition-opacity duration-300",
        isClient || true ? "opacity-100" : "opacity-50"
      )}
    >
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold mb-2">
          Save something worth reading
        </h1>
        <p className="text-muted-foreground">
          Paste an article URL and we'll analyze it for you
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input */}
        <div>
          <Input
            type="url"
            placeholder="Paste article URL here"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            disabled={createItemMutation.isPending}
            className={cn(
              "text-base py-6 px-4",
              error && "border-destructive focus-visible:ring-destructive"
            )}
            autoFocus
          />
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>

        {/* Helper text */}
        <p className="text-sm text-muted-foreground text-center">
          Estimated time & summary will be prepared automatically
        </p>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={createItemMutation.isPending || !url.trim()}
          className="w-full py-6 text-base"
          size="lg"
        >
          {createItemMutation.isPending ? "Saving..." : "Save & Analyze"}
        </Button>
      </form>

      {/* Additional context */}
      <div className="mt-8 pt-8 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          We extract clean text, estimate reading time, and create summaries
          automatically.
        </p>
      </div>
    </div>
  );
};

export default SaveLinkForm;
