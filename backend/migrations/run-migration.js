require('dotenv').config();
const pool = require('../src/config/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        console.log('Connecting to database...');

        // Read the migration file
        const migrationSQL = fs.readFileSync(
            path.join(__dirname, '001_create_tasks_table.sql'),
            'utf8'
        );

        console.log('Running migration...');
        await pool.query(migrationSQL);

        console.log('✅ Migration completed successfully!');
        console.log('✅ Tasks table created with indexes');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();
