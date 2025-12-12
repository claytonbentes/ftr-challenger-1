import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { BadRequestError } from '@/app//functions/errors/bad-request'
import { type Either, makeRight } from '@/infra/shared/either'

const createUrlInput = z.object({
  originalUrl: z.string().url(),
  shortUrl: z.string().regex(/^[a-z0-9-]+$/, {
    message:
      'O ur encurtado deve conter apenas letras minúsculas, números e hífens.',
  }),
})

type CreateUrlInput = z.input<typeof createUrlInput>

type CreateUrlOutput = {
  id: string
}

export async function createUrl(
  input: CreateUrlInput
): Promise<Either<never, CreateUrlOutput>> {
  const { originalUrl, shortUrl } = createUrlInput.parse(input)

  const existingShortLink = await db.query.urls.findFirst({
    where: (urls, { eq }) => eq(urls.shortUrl, shortUrl),
  })

  if (existingShortLink) {
    throw new BadRequestError()
  }

  const url = await db
    .insert(schema.urls)
    .values({
      originalUrl,
      shortUrl,
    })
    .returning()

  return makeRight({
    id: url[0].id,
  })
}
