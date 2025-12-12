import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { deleteUrlById } from '@/app/functions/delete-url'

export const deleteUrlRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/urls/:id',
    {
      schema: {
        summary: 'Delete url by Id',
        description:
          'Delete an url by id',
        tags: ['Urls'],
        params: z.object({
          id: z.string(),
        }),
        response: {
          404: z
            .object({
              message: z.string(),
            })
            .describe('Not Found'),
          204: z.null().describe('No Content'),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      await deleteUrlById({ id })

      return reply.status(204).send()
    }
  )
}
