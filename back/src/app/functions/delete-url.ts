import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { NotFoundError } from '@/app/functions/errors/not-found'
import { type Either, makeRight } from '@/infra/shared/either'

const deleteUrlInput = z.object({
  id: z.string(),
})

type DeleteUrlInput = z.input<typeof deleteUrlInput>

export async function deleteUrlById(
  input: DeleteUrlInput
): Promise<Either<never, null>> {
  const { id } = deleteUrlInput.parse(input)

  const url = await db.query.urls.findFirst({
    where: (urls, { eq }) => eq(urls.id, id),
  })

  if (!url) {
    throw new NotFoundError()
  }

  await db.delete(schema.urls).where(eq(schema.urls.id, id))

  return makeRight(null)
}
