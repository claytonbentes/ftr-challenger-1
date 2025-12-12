import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createUrl } from '@/app/functions/create-url'
import { unwrapEither } from '@/infra/shared/either'

export const createUrlRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/urls',
    {
      schema: {
        summary: 'Create an Url',
        description: 'Create an url',
        body: z.object({
          originalUrl: z.string().url(),
          shortUrl: z.string().regex(/^[a-z0-9-]+$/, {}),
        }),
        response: {
          201: z
            .object({
              id: z.string().uuid(),
            })
            .describe('Created'),
          400: z
            .object({
              message: z.string(),
            })
            .describe('Bad Request'),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body

      const result = await createUrl({ originalUrl, shortUrl })

      const { id } = unwrapEither(result)

      return reply.status(201).send({ id })
    }
  )
}
