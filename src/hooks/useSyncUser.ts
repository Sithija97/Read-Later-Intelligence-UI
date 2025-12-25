import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useApiClient } from "./useApiClient";

/**
 * Hook to sync user details to MongoDB after successful Google sign in/sign up
 * This hook automatically calls the sync-user endpoint when the user is authenticated
 * 
 * @param options - Configuration options
 * @param options.onSuccess - Callback when sync is successful
 * @param options.onError - Callback when sync fails
 * @param options.enabled - Whether to enable the sync (default: true)
 */
export const useSyncUser = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}) => {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();
  const hasSyncedRef = useRef(false);
  const isSyncingRef = useRef(false);
  
  // Store callbacks in refs to avoid unnecessary re-renders
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);
  
  // Update refs when callbacks change
  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);

  const syncUser = useCallback(async () => {
    // Only sync if:
    // 1. Auth is loaded
    // 2. User is signed in
    // 3. Enabled option is true (or not provided, default true)
    // 4. Haven't synced yet in this session
    // 5. Not currently syncing
    if (
      !isLoaded ||
      !isSignedIn ||
      options?.enabled === false ||
      hasSyncedRef.current ||
      isSyncingRef.current
    ) {
      return;
    }

    isSyncingRef.current = true;

    try {
      const response = await api.post("/auth/sync-user");
      hasSyncedRef.current = true;
      
      if (onSuccessRef.current) {
        onSuccessRef.current(response.data);
      }
    } catch (error) {
      // Log error but don't block the app
      console.error("Failed to sync user:", error);
      
      if (onErrorRef.current) {
        onErrorRef.current(error instanceof Error ? error : new Error("Unknown error"));
      }
    } finally {
      isSyncingRef.current = false;
    }
  }, [isLoaded, isSignedIn, options?.enabled, api]);

  useEffect(() => {
    syncUser();
  }, [syncUser]);

  // Reset sync flag when user signs out
  useEffect(() => {
    if (!isSignedIn) {
      hasSyncedRef.current = false;
    }
  }, [isSignedIn]);
};

