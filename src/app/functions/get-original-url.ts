import { z } from 'zod'
import { db } from '@/infra/db'
import { NotFoundError } from '@/app/functions/errors/not-found'
import { type Either, makeRight } from '@/infra/shared/either'

const getOriginalUrlInput = z.object({
  shortUrl: z.string(),
})

type GetOriginalUrlInput = z.input<typeof getOriginalUrlInput>

type GetOriginalUrlOutput = {
  id: string
  originalUrl: string
}

export async function getOriginalUrlByShortUrl(
  input: GetOriginalUrlInput
): Promise<Either<never, GetOriginalUrlOutput>> {
  const { shortUrl } = getOriginalUrlInput.parse(input)

  const url = await db.query.urls.findFirst({
    where: (urls, { eq }) => eq(urls.shortUrl, shortUrl),
  })

  if (!url) {
    throw new NotFoundError()
  }

  return makeRight({
    id: url.id,
    originalUrl: url.originalUrl,
  })
}
