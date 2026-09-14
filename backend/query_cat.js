const db = require('./src/config/db');

async function run() {
    try {
        const [rows] = await db.execute("SELECT id, name, category_type FROM business_type_categories WHERE name LIKE '%Modal%'");
        console.log(rows);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
