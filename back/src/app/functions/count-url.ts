import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { NotFoundError } from '@/app/functions/errors/not-found'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'

const increaseAccessCountInput = z.object({
  id: z.string().uuid(),
})

type IncreaseAccessCountInput = z.input<typeof increaseAccessCountInput>

export async function increaseAccessCountUrl(
  input: IncreaseAccessCountInput
): Promise<Either<never, null>> {
  const { id } = increaseAccessCountInput.parse(input)

  const url = await db.query.urls.findFirst({
    where: eq(schema.urls.id, id),
  })

  if (!url) {
    throw new NotFoundError()
  }

  await db
    .update(schema.urls)
    .set({ accessCount: url.accessCount + 1 })
    .where(eq(schema.urls.id, id))

  return makeRight(null)
}
