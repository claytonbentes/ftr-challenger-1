import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { increaseAccessCountUrl } from '@/app/functions/count-url'

export const increaseAccessCountUrlRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/urls/:id',
    {
      schema: {
        summary: 'Access count of an url',
        description: 'Increase access count of an url',
        tags: ['Urls'],
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.null().describe('No Content'),
          404: z
            .object({
              message: z.string(),
            })
            .describe('Not Found'),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      await increaseAccessCountUrl({ id })

      return reply.status(204).send()
    }
  )
}
