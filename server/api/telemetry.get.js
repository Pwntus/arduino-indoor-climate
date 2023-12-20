import { sql } from '@vercel/postgres'

const queryDatabase = async () => {
  console.log(`--- log (telemetry.get): querying telemetry from database`)

  const result = await sql`SELECT * FROM telemetry;`

  console.log(
    `--- log (telemetry.get): querying telemetry from database... DONE!`
  )

  return result
}

export default defineEventHandler(async (event) => {
  try {
    const result = await queryDatabase()

    return result
  } catch (e) {
    console.log('--- error (telemetry.get): ', e)

    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong with the API request.'
    })
  }
})
