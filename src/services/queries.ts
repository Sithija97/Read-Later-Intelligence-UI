import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { ApiError, type ApiResponse, type ApiRequestOptions } from "./api";

/**
 * Standard query key factory
 * Helps with consistent query key generation across the app
 */
export const queryKeys = {
  items: ["items"],
  item: (id: string) => ["items", id],
  todaysItems: ["items", "today"],
} as const;

/**
 * Types for API requests/responses
 */
export interface CreateItemRequest {
  url: string;
}

export interface CreateItemResponse {
  id: string;
  status: string;
}

/**
 * Generic API query hook factory
 * Creates a React Query hook that uses the API client with Clerk token
 */
export const createApiQuery = <TData = unknown, TError = ApiError>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, "method" | "body">,
  queryOptions?: Omit<
    UseQueryOptions<ApiResponse<TData>, TError>,
    "queryKey" | "queryFn"
  >
) => {
  return () => {
    const api = useApiClient();

    return useQuery<ApiResponse<TData>, TError>({
      queryKey: [endpoint, options?.params],
      queryFn: async () => {
        return await api.get<TData>(endpoint, options);
      },
      ...queryOptions,
    });
  };
};

/**
 * Generic API mutation hook factory
 * Creates a React Query mutation hook that uses the API client with Clerk token
 */
export const createApiMutation = <
  TData = unknown,
  TVariables = unknown,
  TError = ApiError
>(
  mutationFn: (
    api: ReturnType<typeof useApiClient>,
    variables: TVariables
  ) => Promise<ApiResponse<TData>>,
  mutationOptions?: Omit<
    UseMutationOptions<ApiResponse<TData>, TError, TVariables>,
    "mutationFn"
  >
) => {
  return () => {
    const api = useApiClient();

    return useMutation<ApiResponse<TData>, TError, TVariables>({
      mutationFn: async (variables: TVariables) => {
        return await mutationFn(api, variables);
      },
      ...mutationOptions,
    });
  };
};

// Re-export types for convenience
export type { ApiRequestOptions };

/**
 * Sync User Mutation
 * Syncs authenticated user to MongoDB
 */
export const useSyncUserMutation = () => {
  return createApiMutation<unknown, void>(async (api) => {
    return await api.post<unknown>("/auth/sync-user");
  })();
};

/**
 * Create Item Mutation
 * Saves a new article URL for processing
 */
export const useCreateItem = () => {
  return createApiMutation<CreateItemResponse, CreateItemRequest>(
    async (api, variables) => {
      return await api.post<CreateItemResponse>(
        "/items/create-item",
        variables
      );
    },
    {
      onSuccess: (data) => {
        console.log("Item created successfully:", data);
      },
      onError: (error) => {
        console.error("Failed to create item:", error);
      },
    }
  )();
};
