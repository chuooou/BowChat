import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { StrictPropsWithChildren } from "@/shared/types/react";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 2, 
            retry: 1
        }
    }
});

export const QueryProvider = ({children}:  StrictPropsWithChildren) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};