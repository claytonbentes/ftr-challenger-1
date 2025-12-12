import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { unwrapEither } from '@/infra/shared/either'
import { getUrls } from '@/app/functions/get-urls'

export const getUrlsRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/urls',
    {
      schema: {
        summary: 'Get Urls',
        description: 'Retrieve a list of urls.',
        tags: ['Urls'],
        querystring: z.object({
          searchQuery: z.string().optional(),
          sortBy: z.enum(['createdAt']).optional(),
          sortDirection: z.enum(['asc', 'desc']).optional(),
          page: z.coerce.number().optional().default(1),
          pageSize: z.coerce.number().optional().default(10),
        }),
        response: {
          200: z
            .object({
              urls: z.array(
                z.object({
                  id: z.string(),
                  originalUrl: z.string(),
                  shortUrl: z.string(),
                  accessCount: z.number(),
                  createdAt: z.date(),
                })
              ),
              total: z.number(),
            })
            .describe('Ok'),
        },
      },
    },
    async (request, reply) => {
      const { page, pageSize, searchQuery, sortBy, sortDirection } =
        request.query

      const result = await getUrls({
        page,
        pageSize,
        searchQuery,
        sortBy,
        sortDirection,
      })

      const { total, urls } = unwrapEither(result)

      return reply.status(200).send({ total, urls })
    }
  )
}
