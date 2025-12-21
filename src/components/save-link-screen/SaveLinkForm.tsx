import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from '@/lib/utils'

const SaveLinkForm = () => {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(true);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Hydration: switch to pre-client state
    setIsClient(false)

    // Client-side initialization
    const tick = () => {
      // Restore to client state
      setIsClient(true)
    }

    // Use requestAnimationFrame for smooth transition
    const rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

    const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous error
    setError('')

    // Validate URL
    if (!url.trim()) {
      setError('Please paste an article URL')
      return
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL')
      return
    }

    // Set loading state
    setIsLoading(true)

    // Simulate API call and redirect to processing state
    // In a real app, this would send the URL to the backend
    setTimeout(() => {
      // Store URL in sessionStorage for processing state to access
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('articleUrl', url)
        navigate('/loading')
      }
    }, 500)
  }

  return <div className={cn(
      'transition-opacity duration-300',
      (isClient || true) ? 'opacity-100' : 'opacity-50'
    )}>
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
              setUrl(e.target.value)
              setError('')
            }}
            disabled={isLoading}
            className={cn(
              'text-base py-6 px-4',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
            autoFocus
          />
          {error && (
            <p className="text-sm text-destructive mt-2">
              {error}
            </p>
          )}
        </div>

        {/* Helper text */}
        <p className="text-sm text-muted-foreground text-center">
          Estimated time & summary will be prepared automatically
        </p>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full py-6 text-base"
          size="lg"
        >
          {isLoading ? 'Analyzing...' : 'Save & Analyze'}
        </Button>
      </form>

      {/* Additional context */}
      <div className="mt-8 pt-8 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          We extract clean text, estimate reading time, and create summaries automatically.
        </p>
      </div>
    </div>
};

export default SaveLinkForm;
