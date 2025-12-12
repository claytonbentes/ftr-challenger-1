import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { unwrapEither } from '@/infra/shared/either'
import { exportUrls } from '@/app/functions/export-url'

export const exportUrlRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/urls/exports',
    {
      schema: {
        summary: 'Export Urls',
        description: 'Export Urls to CSV',
        tags: ['Urls'],
        querystring: z.object({
          searchQuery: z.string().optional(),
        }),
        response: {
          200: z
            .object({
              reportUrl: z.string(),
            })
            .describe('Ok'),
        },
      },
    },
    async (request, reply) => {
      const { searchQuery } = request.query

      const result = await exportUrls({
        searchQuery,
      })

      const { reportUrl } = unwrapEither(result)

      return reply.status(200).send({ reportUrl })
    }
  )
}
