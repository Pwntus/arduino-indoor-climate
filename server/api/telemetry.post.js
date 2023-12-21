import { sql } from '@vercel/postgres'

const prepareDatabase = async () => {
  console.log(`--- log (telemetry.post): preparing database:`)

  console.log(`--- log (telemetry.post): create new table 'telemetry'`)
  await sql`
    CREATE TABLE IF NOT EXISTS telemetry (
      id bigserial primary key,
      temperature decimal,
      humidity decimal,
      heat_index decimal,
      created_at bigint
    );`

  console.log(`--- log (telemetry.post): preparing database... DONE!`)
}

const insertDatabase = async ({ temperature, humidity, heat_index }) => {
  console.log(`--- log (telemetry.post): inserting telemetry into database`)

  await sql`INSERT INTO telemetry (temperature, humidity, heat_index, created_at) VALUES (${temperature}, ${humidity}, ${heat_index}, ${+new Date()});`

  console.log(
    `--- log (telemetry.post): inserting telemetry into database... DONE!`
  )
}

export default defineEventHandler(async (event) => {
  try {
    const { temperature, humidity, heat_index } = await readBody(event)

    await prepareDatabase()
    await insertDatabase({ temperature, humidity, heat_index })

    return
  } catch (e) {
    console.log('--- error (telemetry.post): ', e)

    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong with the API request.'
    })
  }
})
