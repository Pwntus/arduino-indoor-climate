import { sql } from '@vercel/postgres'

const prepareDatabase = async () => {
  console.log(`--- log (telemetry.post): preparing database:`)

  console.log(`--- log (telemetry.post): create new table 'telemetry'`)
  await sql`
    CREATE TABLE IF NOT EXISTS telemetry (
      id bigserial primary key,
      temperature decimal,
      humidity decimal,
      created_at integer
    );`

  console.log(`--- log (telemetry.post): preparing database... DONE!`)
}

const insertDatabase = async ({ temperature, humidity }) => {
  console.log(`--- log (telemetry.post): inserting telemetry into database`)

  await sql`INSERT INTO telemetry (temperature, humidity, created_at) VALUES (${temperature}, ${humidity}, ${+new Date()});`

  console.log(
    `--- log (telemetry.post): inserting telemetry into database... DONE!`
  )
}

export default defineEventHandler(async (event) => {
  try {
    const { temperature, humidity } = await readBody(event)

    await prepareDatabase()
    await insertDatabase({ temperature, humidity })

    return
  } catch (e) {
    console.log('--- error (telemetry.post): ', e)

    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong with the API request.'
    })
  }
})
