import { useQuery, type UndefinedInitialDataOptions } from "@tanstack/react-query"
import { getOriginalLinkBySlug } from "@/http/short-link"

export function useGetShortLinkBySlug(
    slug: string,
    options?: Omit<UndefinedInitialDataOptions<{ id: string; originalUrl: string }, Error, { id: string; originalUrl: string }, string[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: ['short-links', slug],
        queryFn: () => getOriginalLinkBySlug(slug),
        ...(options ?? {}),
    })
}