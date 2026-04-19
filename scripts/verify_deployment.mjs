import 'dotenv/config';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../src/db/schema.ts';

const { Pool } = pg;

async function verify() {
  console.log('🚀 Starting Production Readiness Audit...\n');

  const requiredEnv = [
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXT_PUBLIC_APP_URL'
  ];

  let missing = [];
  for (const env of requiredEnv) {
    if (!process.env[env]) {
      missing.push(env);
    }
  }

  if (missing.length > 0) {
    console.error('❌ CRITICAL: Missing Environment Variables:');
    missing.forEach(m => console.error(`   - ${m}`));
    process.exit(1);
  } else {
    console.log('✅ Environment Variables: Present');
  }

  // Check DB connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const db = drizzle(pool, { schema });
    await pool.query('SELECT 1');
    console.log('✅ Database Connectivity: Verified');

    // Check for essential tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tableNames = tables.rows.map(r => r.table_name);
    const expectedTables = ['users', 'products', 'user_shares', 'share_transactions', 'site_credits_ledger'];
    
    const missingTables = expectedTables.filter(t => !tableNames.includes(t));
    if (missingTables.length > 0) {
      console.warn('⚠️  WARNING: Missing Tables. This might indicate incomplete migrations:');
      missingTables.forEach(t => console.warn(`   - ${t}`));
    } else {
      console.log('✅ Database Schema: Synchronized');
    }

  } catch (error) {
    console.error('❌ Database Connectivity: FAILED');
    console.error(error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }

  console.log('\n✨ Platform is technically READY for deployment.');
}

verify();
