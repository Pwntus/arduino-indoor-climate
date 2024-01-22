import supabase from './supabase.client'

const queryDatabase = async ({ gte }) => {
  console.log(`--- log (telemetry.get): querying telemetry from database`)

  const { data, error } = await supabase
    .from('telemetry')
    .select()
    .gte('created_at', gte)
    .order('created_at', { ascending: true })

  console.log(
    `--- log (telemetry.get): querying telemetry from database... DONE!`
  )

  return data || []
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
    const AGGREGATE_INTERVAL = 60 // 30 min
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

    return { latest_row, rows }
  } catch (e) {
    console.log('--- error (telemetry.get): ', e)

    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong with the API request.'
    })
  }
})
