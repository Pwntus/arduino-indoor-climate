import { sql } from '@vercel/postgres'

const queryDatabase = async ({ gte }) => {
  console.log(`--- log (telemetry.get): querying telemetry from database`)

  // await sql`DROP TABLE telemetry;`
  const result = await sql`SELECT * FROM telemetry WHERE created_at >= ${gte};`

  console.log(
    `--- log (telemetry.get): querying telemetry from database... DONE!`
  )

  return result?.rows || []
}

export default defineEventHandler(async (event) => {
  try {
    let { gte } = getQuery(event)

    // Sanity check
    gte = gte ? parseInt(gte) : +new Date() - 86400000

    const result = await queryDatabase({ gte })

    // Pick out latest row
    const latest_row = result[result.length - 1]

    // Aggregate
    const AGGREGATE_INTERVAL = 30 // 30 min
    let rows = []
    while (result.length > 0) {
      const bucket = result.splice(0, AGGREGATE_INTERVAL)
      const bucket_size = bucket.length

      if (bucket_size > 0) {
        // Calculate average
        rows.push({
          created_at: parseInt(bucket[Math.floor(bucket_size / 2)].created_at),
          temperature: (
            bucket.reduce(
              (sum, { temperature }) => sum + parseFloat(temperature),
              0
            ) / bucket_size
          ).toFixed(2),
          humidity: (
            bucket.reduce(
              (sum, { humidity }) => sum + parseFloat(humidity),
              0
            ) / bucket_size
          ).toFixed(2),
          heat_index: (
            bucket.reduce(
              (sum, { heat_index }) => sum + parseFloat(heat_index),
              0
            ) / bucket_size
          ).toFixed(2)
        })
      }
    }

    rows = rows.sort((a, b) => a.created_at - b.created_at)

    return { latest_row, rows }
  } catch (e) {
    console.log('--- error (telemetry.get): ', e)

    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong with the API request.'
    })
  }
})
