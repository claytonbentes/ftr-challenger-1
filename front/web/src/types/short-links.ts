export type CreateShortLink = {
    originalUrl: string
    slug: string
}

export type ShortLink = {
    id: string
    originalUrl: string
    shortUrl: string
    accessCount: number
    createdAt: string
}