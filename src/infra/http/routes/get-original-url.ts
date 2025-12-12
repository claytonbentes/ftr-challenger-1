import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { unwrapEither } from '@/infra/shared/either'
import { getOriginalUrlByShortUrl } from '@/app/functions/get-original-url'

export const getOriginalUrl: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/urls/:shortUrl',
    {
      schema: {
        summary: 'Get an url by original URL',
        description: 'Retrieve a short url by its original URL.',
        tags: ['Urls'],
        params: z.object({
          shortUrl: z.string(),
        }),
        response: {
          200: z
            .object({
              id: z.string().uuid(),
              originalUrl: z.string(),
            })
            .describe('Ok'),
          404: z
            .object({
              message: z.string(),
            })
            .describe('Not Found'),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.params

      const result = await getOriginalUrlByShortUrl({ shortUrl })

      const { id, originalUrl } = unwrapEither(result)

      return reply.status(200).send({
        id,
        originalUrl,
      })
    }
  )
}
