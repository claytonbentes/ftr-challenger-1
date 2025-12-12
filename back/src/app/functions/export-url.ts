import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { stringify } from 'csv-stringify'
import { ilike } from 'drizzle-orm'
import { z } from 'zod'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'

const exportUrlsInput = z.object({
  searchQuery: z.string().optional(),
})

type ExportUrlsInput = z.input<typeof exportUrlsInput>

type ExportUrlsOutput = {
  reportUrl: string
}

export async function exportUrls(
  input: ExportUrlsInput
): Promise<Either<never, ExportUrlsOutput>> {
  const { searchQuery } = exportUrlsInput.parse(input)

  const { sql, params } = db
    .select({
      id: schema.urls.id,
      originalUrl: schema.urls.originalUrl,
      shortUrl: schema.urls.shortUrl,
      accessCount: schema.urls.accessCount,
      createdAt: schema.urls.createdAt,
    })
    .from(schema.urls)
    .where(
      searchQuery
        ? ilike(schema.urls.originalUrl, `%${searchQuery}%`)
        : undefined
    )
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(2)

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'original_url', header: 'Original URL' },
      { key: 'short_url', header: 'Short URL' },
      { key: 'access_count', header: 'Access Count' },
      { key: 'created_at', header: 'Created at' },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], _, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }

        callback()
      },
    }),
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'reports',
    fileName: `${new Date().toISOString()}-links.csv`,
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])

  return makeRight({ reportUrl: url })
}
