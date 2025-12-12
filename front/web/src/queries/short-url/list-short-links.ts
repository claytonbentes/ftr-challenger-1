import { useQuery, type UndefinedInitialDataOptions } from "@tanstack/react-query"
import { listShortLinks } from "../../http/short-link"
import { queryClient } from "@/queries/client"
import type { ShortLink } from "../../types/short-links"

export function useListShortLinks(
    options?: Omit<UndefinedInitialDataOptions<ShortLink[], Error, ShortLink[], string[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: ['short-links'],
        queryFn: () => listShortLinks(),
        ...(options ?? {}),
    })
}

export async function invalidateShortLinks() {
    await queryClient.invalidateQueries({ queryKey: ['short-links'] })
}