import pkg from 'pg';
const { Client } = pkg;


const client = new Client({
  connectionString: 'postgresql://postgres:LetMeGetaces232823@109.205.181.195:5432/prodomatix'
});

const sql = `
  ALTER TABLE "user_behavior" ADD COLUMN IF NOT EXISTS "intensity_score" numeric(10, 2) DEFAULT 0.00;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "intent_class" varchar(30) DEFAULT 'explorer';
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "churn_risk" numeric(5, 2) DEFAULT 0.00;
`;

async function run() {
  try {
    await client.connect();
    console.log('Connected to DB');
    await client.query(sql);
    console.log('Behavioral fields added successfully');
  } catch (err) {
    console.error('Error adding behavioral fields:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
