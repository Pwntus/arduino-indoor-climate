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

    console.log('DEBUG', gte)

    const result = await queryDatabase({ gte })

    return result
  } catch (e) {
    console.log('--- error (telemetry.get): ', e)

    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong with the API request.'
    })
  }
})
