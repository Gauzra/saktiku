const db = require('./src/config/db');

async function run() {
    try {
        // Update accounts with name 'Modal Awal' to 'Modal'
        const [res1] = await db.execute("UPDATE accounts SET name = 'Modal' WHERE code = '3101' AND name = 'Modal Awal'");
        console.log('Updated accounts: ', res1.affectedRows);
        
        // Update default_accounts with name 'Modal Awal' to 'Modal' (if exists)
        // Wait, what are the tables?
        
        // Update business_type_categories
        const [res2] = await db.execute("UPDATE business_type_categories SET category_name = 'Setoran Modal' WHERE category_name = 'Modal Awal' OR category_name = 'Modal Awal'");
        console.log('Updated business_type_categories: ', res2.affectedRows);
        
        // Update default_categories
        const [res3] = await db.execute("UPDATE categories SET name = 'Setoran Modal' WHERE name = 'Modal Awal'");
        console.log('Updated categories: ', res3.affectedRows);
        
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
