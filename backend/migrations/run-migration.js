require('dotenv').config();
const pool = require('../src/config/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        console.log('Connecting to database...');

        // Get migration file from command line or run all
        const migrationFiles = [
            '001_create_tasks_table.sql',
            '002_create_users_table.sql'
        ];

        for (const file of migrationFiles) {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                console.log(`Running migration: ${file}...`);
                const migrationSQL = fs.readFileSync(filePath, 'utf8');
                await pool.query(migrationSQL);
                console.log(`✅ ${file} completed`);
            }
        }

        console.log('✅ All migrations completed successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();
